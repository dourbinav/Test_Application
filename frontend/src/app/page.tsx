import LoginForm from "@/components/auth/LoginForm";
import DashboardPage from "./dashboard/page";

const isLoggedIn = false; // change this later with real auth check

export default function Home() {
  return <div>{isLoggedIn ? <DashboardPage /> : <LoginForm />}</div>;
}
