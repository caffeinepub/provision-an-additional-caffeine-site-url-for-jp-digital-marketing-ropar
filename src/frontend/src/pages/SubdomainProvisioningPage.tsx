import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { validateSubdomain, RESERVED_SUBDOMAIN } from '@/lib/subdomainValidation';
import { ProvisioningStatusPanel } from '@/components/ProvisioningStatusPanel';
import { CheckCircle2, AlertCircle, Globe, Loader2, Power, Settings, Trash2, Info } from 'lucide-react';
import { useIsPublished, usePublish, useGetSubdomain, useUnpublish, useGetDomain, useConfigureDomain, useResetSiteStorage } from '@/hooks/useQueries';
import { toast } from 'sonner';

const DEFAULT_CUSTOM_DOMAIN = 'jpdigitalmarketing.in';

export function SubdomainProvisioningPage() {
  const [subdomain, setSubdomain] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedSubdomain, setConfirmedSubdomain] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState('');
  const [hasUserEditedDomain, setHasUserEditedDomain] = useState(false);

  const { data: isPublished, isLoading: isLoadingPublished } = useIsPublished();
  const { data: publishedSubdomain, isLoading: isLoadingSubdomain } = useGetSubdomain();
  const { data: configuredDomain, isLoading: isLoadingDomain } = useGetDomain();
  const publishMutation = usePublish();
  const unpublishMutation = useUnpublish();
  const configureDomainMutation = useConfigureDomain();
  const resetMutation = useResetSiteStorage();

  // When the site is published, use the backend-fetched subdomain
  useEffect(() => {
    if (isPublished && publishedSubdomain) {
      setConfirmedSubdomain(publishedSubdomain);
      setSubdomain(publishedSubdomain);
      setIsSubmitted(true);
      setValidationError(null);
    }
  }, [isPublished, publishedSubdomain]);

  // Load configured domain or pre-fill with default
  useEffect(() => {
    if (configuredDomain) {
      setCustomDomain(configuredDomain);
      setHasUserEditedDomain(true);
    } else if (!hasUserEditedDomain && !isLoadingDomain) {
      // Pre-fill with default when backend has no domain and user hasn't edited
      setCustomDomain(DEFAULT_CUSTOM_DOMAIN);
    }
  }, [configuredDomain, isLoadingDomain, hasUserEditedDomain]);

  const handleSubdomainChange = (value: string) => {
    setSubdomain(value);
    setValidationError(null);
    setIsSubmitted(false);
  };

  const handleCustomDomainChange = (value: string) => {
    setCustomDomain(value);
    setHasUserEditedDomain(true);
  };

  const handleValidate = () => {
    const error = validateSubdomain(subdomain);
    if (error) {
      setValidationError(error);
      setIsSubmitted(false);
      setConfirmedSubdomain(null);
    } else {
      setValidationError(null);
      setIsSubmitted(true);
      setConfirmedSubdomain(subdomain);
    }
  };

  const handleReset = () => {
    setSubdomain('');
    setValidationError(null);
    setIsSubmitted(false);
    setConfirmedSubdomain(null);
  };

  const handlePublish = async () => {
    if (!confirmedSubdomain) {
      toast.error('Publication Failed', {
        description: 'No subdomain confirmed for publication.',
      });
      return;
    }

    try {
      await publishMutation.mutateAsync(confirmedSubdomain);
      const primaryUrl = configuredDomain || customDomain.trim() || `${confirmedSubdomain}.caffeine.xyz`;
      toast.success('Site Published Successfully', {
        description: `Your site is now live at ${primaryUrl}`,
      });
    } catch (error) {
      toast.error('Publication Failed', {
        description: 'An error occurred while publishing your site. Please try again.',
      });
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishMutation.mutateAsync();
      toast.success('Site Unpublished', {
        description: 'Your site has been taken offline successfully.',
      });
    } catch (error) {
      toast.error('Unpublish Failed', {
        description: 'An error occurred while unpublishing your site. Please try again.',
      });
    }
  };

  const handleConfigureDomain = async () => {
    if (!customDomain.trim()) {
      toast.error('Invalid Domain', {
        description: 'Please enter a valid custom domain.',
      });
      return;
    }

    try {
      await configureDomainMutation.mutateAsync(customDomain.trim());
      toast.success('Custom Domain Configured', {
        description: `Your custom domain ${customDomain.trim()} has been set as the primary URL.`,
      });
    } catch (error) {
      toast.error('Configuration Failed', {
        description: 'An error occurred while configuring your custom domain. Please try again.',
      });
    }
  };

  const handleDeleteReset = async () => {
    try {
      await resetMutation.mutateAsync();
      // Clear local state
      setSubdomain('');
      setValidationError(null);
      setIsSubmitted(false);
      setConfirmedSubdomain(null);
      setCustomDomain(DEFAULT_CUSTOM_DOMAIN);
      setHasUserEditedDomain(false);
      
      toast.success('Site Configuration Reset', {
        description: 'All site configuration has been deleted successfully.',
      });
    } catch (error) {
      toast.error('Reset Failed', {
        description: 'An error occurred while resetting your site configuration. Please try again.',
      });
    }
  };

  const fullDomain = subdomain ? `${subdomain}.caffeine.xyz` : '';
  const isReadyToDeploy = isSubmitted && confirmedSubdomain && !validationError;

  // Display the published subdomain from backend when available
  const displaySubdomain = isPublished && publishedSubdomain ? publishedSubdomain : confirmedSubdomain;
  
  // Primary URL is custom domain if configured, otherwise caffeine.xyz subdomain
  const primaryUrl = configuredDomain || (displaySubdomain ? `${displaySubdomain}.caffeine.xyz` : null);

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Provision Your Caffeine Subdomain
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create a unique subdomain for your new website. Choose a memorable name that represents your brand.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Subdomain Configuration</CardTitle>
              <CardDescription>
                Enter your desired subdomain. It must be unique and follow our naming guidelines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  The <span className="font-semibold">.caffeine.xyz</span> URL is a preview/draft link for provisioning. 
                  Your primary public URL should be your custom domain (e.g., <span className="font-semibold">{DEFAULT_CUSTOM_DOMAIN}</span>).
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="subdomain" className="text-base font-medium">
                  Subdomain Name
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      id="subdomain"
                      type="text"
                      placeholder="your-subdomain"
                      value={subdomain}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      className="pr-32 text-base h-12"
                      disabled={isSubmitted || isPublished}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                      .caffeine.xyz
                    </div>
                  </div>
                </div>
                {fullDomain && !validationError && !isSubmitted && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Preview URL: <span className="font-medium text-foreground">{fullDomain}</span>
                  </p>
                )}
              </div>

              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              {isSubmitted && displaySubdomain && !isPublished && (
                <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Subdomain validated successfully! Preview URL:{' '}
                    <span className="font-semibold">{displaySubdomain}.caffeine.xyz</span>
                  </AlertDescription>
                </Alert>
              )}

              {isPublished && primaryUrl && (
                <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Your site is now published live at{' '}
                    <span className="font-semibold">{primaryUrl}</span>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 pt-2">
                {!isSubmitted && !isPublished ? (
                  <Button
                    onClick={handleValidate}
                    disabled={!subdomain.trim()}
                    size="lg"
                    className="flex-1"
                  >
                    Validate Subdomain
                  </Button>
                ) : isPublished ? (
                  <>
                    <Button size="lg" className="flex-1" disabled>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Published Live
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="lg" 
                          variant="destructive"
                          disabled={unpublishMutation.isPending}
                        >
                          {unpublishMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Unpublishing...
                            </>
                          ) : (
                            <>
                              <Power className="w-4 h-4 mr-2" />
                              Unpublish
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Unpublish Site?</AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <p>
                              You are about to take your site offline. It will no longer be accessible at{' '}
                              <span className="font-semibold text-foreground">{primaryUrl}</span>.
                            </p>
                            <p>
                              You can republish your site at any time.
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleUnpublish} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Unpublish Site
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <>
                    <Button onClick={handleReset} variant="outline" size="lg" className="flex-1">
                      Choose Different Name
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="lg" 
                          className="flex-1"
                          disabled={!isReadyToDeploy || publishMutation.isPending}
                        >
                          {publishMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            'Publish Permanently'
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Publish Site to Production?</AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <p>
                              You are about to publish your site permanently to production at{' '}
                              <span className="font-semibold text-foreground">{confirmedSubdomain}.caffeine.xyz</span>.
                            </p>
                            <p className="text-muted-foreground">
                              Your site will be live and accessible to everyone.
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handlePublish}>
                            Publish to Production
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>

              <div className="pt-4 border-t space-y-3">
                <h3 className="font-semibold text-sm">Naming Guidelines</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use lowercase letters, numbers, and hyphens only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Must be between 3 and 63 characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Cannot start or end with a hyphen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Must be unique (not already in use)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Custom Domain Configuration
              </CardTitle>
              <CardDescription>
                Configure your primary custom domain (e.g., {DEFAULT_CUSTOM_DOMAIN})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customDomain" className="text-base font-medium">
                  Custom Domain
                </Label>
                <Input
                  id="customDomain"
                  type="text"
                  placeholder={DEFAULT_CUSTOM_DOMAIN}
                  value={customDomain}
                  onChange={(e) => handleCustomDomainChange(e.target.value)}
                  className="text-base h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your custom domain name. This will be your primary public URL.
                </p>
              </div>

              <Button
                onClick={handleConfigureDomain}
                disabled={!customDomain.trim() || configureDomainMutation.isPending}
                size="lg"
                className="w-full"
              >
                {configureDomainMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Configuring...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Custom Domain
                  </>
                )}
              </Button>

              {configuredDomain && (
                <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Custom domain configured: <span className="font-semibold">{configuredDomain}</span>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete all site configuration and reset to defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="lg"
                    disabled={resetMutation.isPending}
                    className="w-full"
                  >
                    {resetMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete & Reset Site Configuration
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Site Configuration?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p className="font-semibold text-destructive">
                        This action cannot be undone!
                      </p>
                      <p>
                        This will permanently delete:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Your published subdomain configuration</li>
                        <li>Your custom domain settings</li>
                        <li>All provisioning state</li>
                      </ul>
                      <p>
                        Your site will be taken offline and all settings will be reset to defaults.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteReset}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ProvisioningStatusPanel
              isPublished={isPublished ?? false}
              subdomain={displaySubdomain}
              customDomain={configuredDomain ?? null}
              isValidated={isSubmitted}
              hasError={!!validationError}
              isLoadingPublished={isLoadingPublished}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
