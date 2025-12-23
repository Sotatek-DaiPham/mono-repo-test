import { useState } from 'react';

// Basic UI Components (will be replaced with actual components later)
const Button = ({ children, variant = 'default', ...props }: { children: React.ReactNode; variant?: string; [key: string]: any }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variants: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button className={`${baseClasses} ${variants[variant] || variants.default}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-500 mt-1">{children}</p>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

const Input = ({ className = '', ...props }: { className?: string; [key: string]: any }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) => {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 bg-white',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

const Alert = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) => {
  const variants: Record<string, string> = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
  };
  return (
    <div className={`border rounded-md p-4 ${variants[variant] || variants.default}`}>
      {children}
    </div>
  );
};

const components = [
  { id: 'buttons', name: 'Buttons' },
  { id: 'inputs', name: 'Inputs' },
  { id: 'cards', name: 'Cards' },
  { id: 'badges', name: 'Badges' },
  { id: 'alerts', name: 'Alerts' },
];

export function UIShowcasePage() {
  const [selectedComponent, setSelectedComponent] = useState('buttons');
  const [inputValue, setInputValue] = useState('');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'buttons':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button disabled>Disabled</Button>
                <Button>Normal</Button>
              </div>
            </div>
          </div>
        );

      case 'inputs':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Text Input</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" value={inputValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" />
                </div>
                <div>
                  <Label htmlFor="disabled">Disabled</Label>
                  <Input id="disabled" disabled placeholder="Disabled input" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is the card content area.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Another Card</CardTitle>
                  <CardDescription>With different content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>You can put any content here.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'badges':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            <Alert>
              <div className="font-medium mb-1">Info</div>
              <div className="text-sm">This is an informational alert.</div>
            </Alert>
            <Alert variant="success">
              <div className="font-medium mb-1">Success</div>
              <div className="text-sm">Operation completed successfully.</div>
            </Alert>
            <Alert variant="destructive">
              <div className="font-medium mb-1">Error</div>
              <div className="text-sm">Something went wrong. Please try again.</div>
            </Alert>
          </div>
        );

      default:
        return <div>Component not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">UI Component Showcase</h1>
          <p className="text-gray-600">Preview and test all available UI components</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-1 bg-white rounded-lg border border-gray-200 p-2">
              {components.map((component) => (
                <button
                  key={component.id}
                  onClick={() => setSelectedComponent(component.id)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    selectedComponent === component.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {component.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>{components.find((c) => c.id === selectedComponent)?.name}</CardTitle>
                <CardDescription>
                  Preview and interact with {components.find((c) => c.id === selectedComponent)?.name.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>{renderComponent()}</CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

