import { useMutation, useQuery } from "@tanstack/react-query";
import type { PinterestPinContent } from "../backend.d";
import { useActor } from "./useActor";

export function useGeneratePins() {
  const { actor } = useActor();
  return useMutation<PinterestPinContent, Error, string>({
    mutationFn: async (blogUrl: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.generatePins(blogUrl);
    },
  });
}

export function useAllGeneratedPins() {
  const { actor, isFetching } = useActor();
  return useQuery<PinterestPinContent[]>({
    queryKey: ["allGeneratedPins"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGeneratedPins();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePinsByUrl(url: string) {
  const { actor, isFetching } = useActor();
  return useQuery<PinterestPinContent>({
    queryKey: ["pinsByUrl", url],
    queryFn: async () => {
      if (!actor || !url) throw new Error("No URL");
      return actor.getGeneratedPinsByUrl(url);
    },
    enabled: !!actor && !isFetching && !!url,
  });
}
