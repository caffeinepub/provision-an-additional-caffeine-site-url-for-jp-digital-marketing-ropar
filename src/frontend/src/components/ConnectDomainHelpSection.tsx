import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Globe, Clock, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ConnectDomainHelpSection() {
  const dnsRecords = [
    {
      type: 'A',
      host: '@',
      pointsTo: '34.160.111.145',
      description: 'Root domain record'
    },
    {
      type: 'CNAME',
      host: 'www',
      pointsTo: 'cname.caffeine.xyz',
      description: 'WWW subdomain record'
    }
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard', {
      description: `${label} copied successfully.`
    });
  };

  return (
    <Card className="shadow-lg border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Connect Your Domain
        </CardTitle>
        <CardDescription>
          Add these DNS records in your domain provider (iFreeDomains, GoDaddy, Namecheap, etc.) to connect your custom domain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            DNS changes typically take <span className="font-semibold">5–30 minutes</span> to propagate. 
            In some cases, it may take up to 48 hours for full global propagation.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Required DNS Records</h4>
          
          {dnsRecords.map((record, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono">
                  {record.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{record.description}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Host / Name</p>
                    <p className="text-sm font-mono font-semibold">{record.host}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(record.host, 'Host')}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Points To / Value</p>
                    <p className="text-sm font-mono font-semibold break-all">{record.pointsTo}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(record.pointsTo, 'Value')}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 space-y-2">
          <h4 className="text-sm font-semibold">How to Add DNS Records</h4>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Log in to your domain provider (iFreeDomains, GoDaddy, Namecheap, etc.)</li>
            <li>Navigate to <span className="font-semibold text-foreground">DNS Management</span> or <span className="font-semibold text-foreground">DNS Settings</span></li>
            <li>Add the two DNS records shown above with the exact values</li>
            <li>Save your changes and wait 5–30 minutes for propagation</li>
          </ol>
        </div>

        <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <AlertDescription className="text-amber-800 dark:text-amber-200 text-xs">
            <span className="font-semibold">Important:</span> Make sure to add both records. 
            The A record connects your root domain, and the CNAME record connects the www subdomain.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
