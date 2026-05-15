import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import LoginButton from "./_component/login-button";

export default function LoginPage() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   // Simulate login
  //   setTimeout(() => setIsLoading(false), 1000);
  // };

  // const handleOAuth = (provider: string) => {
  //   console.log(`Login with ${provider}`);
  // };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Industrial Illustration */}
        <div className="hidden lg:flex flex-col justify-center items-center relative">
          <Image
            src={"/2-Gioi-Thieu.jpg"}
            className="absolute inset-0 opacity-10 object-cover"
            alt="banner"
            fill
            priority
          />

          {/* Content */}
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-6">
              {/* Industrial Icon Cluster */}
              <div className="inline-flex items-center justify-center ">
                <Image src={"/logo-01.png"} width={70} height={70} alt="logo" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-3">
              Hệ thống Quản lý Thiết bị Công Nghệ
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Streamline your equipment operations with real-time tracking and
              analytics
            </p>

            {/* Feature Pills */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">
                  Real-time equipment monitoring
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">
                  Predictive maintenance alerts
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">
                  Centralized asset management
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-bold">
                    ER
                  </span>
                </div>
                <span className="text-xl font-bold text-foreground">
                  Equipment Registry
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Centralized machinery and equipment management platform
              </p>
            </div>

            {/* Login Form */}
            {/* <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
            {/* <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                required
              />
            </div> */}

            {/* Password Field */}
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                required
              />
            </div> */}

            {/* Remember Me */}
            {/* <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-border"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me for 30 days
              </Label>
            </div> */}

            {/* Login Button */}
            {/* <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button> */}
            {/* </form> */}

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <Separator className="bg-border flex-1" />
              <span className="text-xs text-muted-foreground font-medium">
                OR CONTINUE WITH
              </span>
              <Separator className="bg-border flex-1" />
            </div>

            {/* OAuth Buttons */}
            {/* <div className="space-y-3">
              <Button
                type="button"
                onClick={() => handleOAuth("Google")}
                className="w-full h-10 bg-card border border-border text-foreground hover:bg-card/80 transition-colors font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                onClick={() => handleOAuth("Microsoft")}
                className="w-full h-10 bg-card border border-border text-foreground hover:bg-card/80 transition-colors font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"
                  />
                </svg>
                Continue with Microsoft
              </Button>
            </div> */}

            {/* Footer */}
            <LoginButton />
          </div>
        </div>
      </div>

      {/* Mobile Left Side Banner - Shows on Mobile */}
      <div className="fixed inset-0 -z-10 lg:hidden bg-gradient-to-br from-primary/5 to-background pointer-events-none" />
    </div>
  );
}
