import { MainLayout } from '@/widgets/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';
import { CheckSquare, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <CheckSquare className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Welcome to TaskFlow
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Organize your tasks and boost your productivity
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={ROUTES.LOGIN}>
                <Button size="lg" className="btn-primary">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Organize</CardTitle>
                <CardDescription>
                  Keep all your tasks in one place
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Track</CardTitle>
                <CardDescription>
                  Monitor your progress and deadlines
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Complete</CardTitle>
                <CardDescription>
                  Achieve your goals with ease
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

