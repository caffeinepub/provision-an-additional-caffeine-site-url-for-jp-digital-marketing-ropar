import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, AlertTriangle, Rocket, Globe } from 'lucide-react';

interface ProvisioningStatusPanelProps {
  subdomain: string | null;
  customDomain: string | null;
  isValidated: boolean;
  hasError: boolean;
  isPublished: boolean;
  isLoadingPublished: boolean;
}

export function ProvisioningStatusPanel({ 
  subdomain, 
  customDomain,
  isValidated, 
  hasError, 
  isPublished,
  isLoadingPublished 
}: ProvisioningStatusPanelProps) {
  const getStatusInfo = () => {
    if (isPublished) {
      return {
        icon: Rocket,
        label: 'Published Live',
        variant: 'default' as const,
        description: 'Your site is live in production',
        color: 'text-green-600 dark:text-green-400'
      };
    }
    if (hasError) {
      return {
        icon: XCircle,
        label: 'Invalid',
        variant: 'destructive' as const,
        description: 'Please correct the errors above',
        color: 'text-destructive'
      };
    }
    if (isValidated && subdomain) {
      return {
        icon: CheckCircle2,
        label: 'Ready to Deploy',
        variant: 'default' as const,
        description: 'Subdomain validated successfully',
        color: 'text-green-600 dark:text-green-400'
      };
    }
    if (subdomain && !isValidated) {
      return {
        icon: Clock,
        label: 'Awaiting Validation',
        variant: 'secondary' as const,
        description: 'Click validate to check availability',
        color: 'text-muted-foreground'
      };
    }
    return {
      icon: AlertTriangle,
      label: 'Not Started',
      variant: 'outline' as const,
      description: 'Enter a subdomain to begin',
      color: 'text-muted-foreground'
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  // Primary URL is custom domain if configured, otherwise caffeine.xyz subdomain
  const primaryUrl = customDomain || (subdomain ? `${subdomain}.caffeine.xyz` : null);
  const caffeineUrl = subdomain ? `${subdomain}.caffeine.xyz` : null;

  return (
    <Card className="shadow-lg sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Provisioning Status</CardTitle>
        <CardDescription>Current request state</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-muted ${status.color}`}>
            <StatusIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <Badge variant={status.variant} className="mb-1">
              {status.label}
            </Badge>
            <p className="text-xs text-muted-foreground">{status.description}</p>
          </div>
        </div>

        {isPublished && primaryUrl && (
          <div className="pt-4 border-t space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Primary URL
            </h4>
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm font-mono break-all">{primaryUrl}</p>
            </div>
            {customDomain && (
              <p className="text-xs text-muted-foreground">
                This is your main public URL
              </p>
            )}
          </div>
        )}

        {!isPublished && subdomain && (
          <div className="pt-4 border-t space-y-2">
            <h4 className="text-sm font-semibold">Requested Subdomain</h4>
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm font-mono break-all">{subdomain}.caffeine.xyz</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Preview/draft URL for provisioning
            </p>
          </div>
        )}

        {isPublished && subdomain && customDomain && caffeineUrl && (
          <div className="pt-4 border-t space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Preview/Draft URL</h4>
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-xs font-mono break-all text-muted-foreground">{caffeineUrl}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Internal provisioning detail
            </p>
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          <h4 className="text-sm font-semibold">Next Steps</h4>
          <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
            <li className={subdomain ? 'line-through opacity-50' : ''}>Enter subdomain name</li>
            <li className={isValidated ? 'line-through opacity-50' : ''}>Validate availability</li>
            <li className={isPublished ? 'line-through opacity-50' : isValidated ? 'font-semibold text-foreground' : ''}>
              Publish to production
            </li>
          </ol>
        </div>

        {isPublished && primaryUrl && (
          <div className="pt-4 border-t">
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-500/50 rounded-md p-3">
              <p className="text-xs text-green-800 dark:text-green-200 font-medium">
                Your site is now live and accessible to everyone!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
