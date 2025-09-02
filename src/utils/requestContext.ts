import { AsyncLocalStorage } from "node:async_hooks";

type RequestContextStore = {
  requestId?: string;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestContextStore>();

export const requestContext = {
  run<T>(store: RequestContextStore, callback: () => T): T {
    return asyncLocalStorage.run(store, callback);
  },
  get(): RequestContextStore | undefined {
    return asyncLocalStorage.getStore();
  },
  set(values: Partial<RequestContextStore>): void {
    const store = asyncLocalStorage.getStore();
    if (!store) return;
    Object.assign(store, values);
  },
};

export const getRequestIdFromContext = (): string | undefined => {
  return requestContext.get()?.requestId;
};
