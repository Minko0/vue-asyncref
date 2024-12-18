import {customRef} from "vue";

function isPromise<T>(value: T | Promise<T>) {
    return value && typeof (value as any).then === "function";
}

export function asyncRef<T>(value: T | Promise<T>, onReject?: (error: any) => void) {
    return customRef((track, trigger) => {
        let resolvedValue: null | T = null;

        if (isPromise(value)) {
            Promise.resolve(value).then(newValue => {
                resolvedValue = newValue;
                trigger();
            }).catch(reason => {
                if (onReject !== undefined) {
                    onReject(reason);
                } else {
                    throw reason;
                }
            });
        } else {
            resolvedValue = value as T;
        }

        return {
            get() {
                track();
                return resolvedValue as T;
            },
            set(newValue) {
                if (isPromise(newValue)) {
                    Promise.resolve(newValue).then((newResolvedValue) => {
                        resolvedValue = newResolvedValue;
                        trigger();
                    }).catch((reason) => {
                        resolvedValue = null;
                        trigger();
                        if (onReject !== undefined) {
                            onReject(reason);
                        } else {
                            throw reason;
                        }
                    });
                } else {
                    resolvedValue = newValue;
                    trigger();
                }
            }
        }
    })
}
