import LoginButton from "./_component/login-button";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            EMS Pro
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "var(--color-text-muted)",
            }}
          >
            Equipment Management System
          </p>
        </div>

        <LoginButton />
      </div>
    </main>
  );
}
