using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace EventManagementService.Data;

// Code-first bootstrapper for a shared SQL Server database. Three concerns:
//   1) Wait for the DB server to be reachable (LocalDB cold start can take a moment).
//   2) Create the database if it is missing — without letting EF log a command
//      error when another service wins the race.
//   3) Create only the tables this context owns that aren't already present.
// No EF migrations are used; the model is the source of truth.
internal static class DbInitializer
{
    public static void Initialize(DbContext db, string serviceLabel)
    {
        var connectionString = db.Database.GetConnectionString()
            ?? throw new InvalidOperationException("No connection string configured.");

        EnsureDatabase(connectionString, serviceLabel);
        CreateMissingTables(db, serviceLabel);
    }

    private static void EnsureDatabase(string connectionString, string serviceLabel)
    {
        var target = new SqlConnectionStringBuilder(connectionString);
        var dbName = target.InitialCatalog;
        if (string.IsNullOrWhiteSpace(dbName))
        {
            throw new InvalidOperationException("Connection string is missing a database name.");
        }
        ValidateIdentifier(dbName);

        var masterBuilder = new SqlConnectionStringBuilder(connectionString)
        {
            InitialCatalog = "master"
        };

        for (var attempt = 1; attempt <= 5; attempt++)
        {
            try
            {
                using var conn = new SqlConnection(masterBuilder.ConnectionString);
                conn.Open();

                using (var check = conn.CreateCommand())
                {
                    check.CommandText = "SELECT DB_ID(@name)";
                    check.Parameters.AddWithValue("@name", dbName);
                    if (check.ExecuteScalar() is int) return;
                }

                using var create = conn.CreateCommand();
                create.CommandText = $"CREATE DATABASE [{dbName}]";
                try
                {
                    create.ExecuteNonQuery();
                }
                catch (SqlException ex) when (ex.Number == 1801)
                {
                    // Another service created it between our check and our create.
                }
                return;
            }
            catch (Exception ex) when (attempt < 5)
            {
                Console.WriteLine($"[{serviceLabel}] DB ensure attempt {attempt} failed: {ex.Message}. Retrying...");
                Thread.Sleep(attempt * 2000);
            }
        }
    }

    private static void CreateMissingTables(DbContext db, string serviceLabel)
    {
        var modelTables = db.Model.GetEntityTypes()
            .Select(e => e.GetTableName())
            .Where(n => !string.IsNullOrWhiteSpace(n))
            .Select(n => n!)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var existing = QueryExistingTables(db);
        if (modelTables.All(existing.Contains)) return;

        // Any missing table means we run the full create script; each statement
        // is guarded so already-present tables/indexes don't abort the rest.
        var script = db.Database.GenerateCreateScript();
        var statements = script.Split(
            new[] { "\r\nGO\r\n", "\nGO\n", "\r\nGO\r", "\nGO", ";\r\n", ";\n" },
            StringSplitOptions.RemoveEmptyEntries);

        foreach (var raw in statements)
        {
            var statement = raw.Trim();
            if (statement.Length == 0) continue;
            try
            {
                db.Database.ExecuteSqlRaw(statement);
            }
            catch (Exception ex) when (IsAlreadyExists(ex))
            {
                // Safe race: another service or a prior run created this object.
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[{serviceLabel}] DDL failed: {ex.Message}");
                throw;
            }
        }
    }

    private static HashSet<string> QueryExistingTables(DbContext db)
    {
        var tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        using var conn = new SqlConnection(db.Database.GetConnectionString());
        conn.Open();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            tables.Add(reader.GetString(0));
        }
        return tables;
    }

    private static bool IsAlreadyExists(Exception ex) =>
        ex.Message.Contains("already an object named", StringComparison.OrdinalIgnoreCase) ||
        ex.Message.Contains("already exists", StringComparison.OrdinalIgnoreCase);

    private static void ValidateIdentifier(string name)
    {
        foreach (var c in name)
        {
            if (c == '[' || c == ']' || c == ';' || c < ' ')
            {
                throw new ArgumentException($"Invalid database identifier: '{name}'");
            }
        }
    }
}
