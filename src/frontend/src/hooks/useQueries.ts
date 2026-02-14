import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * Query hook to check if the site is published
 */
export function useIsPublished() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isPublished'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isPublished();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Query hook to get the published subdomain from the backend
 */
export function useGetSubdomain() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['subdomain'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSubdomain();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Query hook to get the custom domain from the backend
 */
export function useGetDomain() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['domain'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDomain();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Mutation hook to publish the site permanently with a subdomain
 */
export function usePublish() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subdomain: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.publish(subdomain);
    },
    onSuccess: () => {
      // Invalidate and refetch both published status and subdomain
      queryClient.invalidateQueries({ queryKey: ['isPublished'] });
      queryClient.invalidateQueries({ queryKey: ['subdomain'] });
    },
  });
}

/**
 * Mutation hook to unpublish the site
 */
export function useUnpublish() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.unpublish();
    },
    onSuccess: () => {
      // Invalidate and refetch publish status and related queries
      queryClient.invalidateQueries({ queryKey: ['isPublished'] });
      queryClient.invalidateQueries({ queryKey: ['subdomain'] });
      queryClient.invalidateQueries({ queryKey: ['domain'] });
    },
  });
}

/**
 * Mutation hook to configure a custom domain
 */
export function useConfigureDomain() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domain: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.configureDomain(domain);
    },
    onSuccess: () => {
      // Invalidate and refetch domain data
      queryClient.invalidateQueries({ queryKey: ['domain'] });
    },
  });
}

/**
 * Mutation hook to reset site storage (delete/reset all configuration)
 */
export function useResetSiteStorage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.resetSiteStorage();
    },
    onSuccess: () => {
      // Invalidate all related queries to refresh UI to unconfigured state
      queryClient.invalidateQueries({ queryKey: ['isPublished'] });
      queryClient.invalidateQueries({ queryKey: ['subdomain'] });
      queryClient.invalidateQueries({ queryKey: ['domain'] });
    },
  });
}
