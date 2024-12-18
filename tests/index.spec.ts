import {vi, describe, expect, it} from "vitest";
import {asyncRef} from "../src";
describe("asyncRef", () => {
    it("should set initial value as value instantly when it's set with a non Promise value", () => {
        const value = "test"
        const ref = asyncRef(value);
        expect(ref.value).toBe(value);
    });

    it("should first return null before the first promise resolve cycle of the runtime when set with a Promise", async () => {
        const value = "test";
        const promiseValue = new Promise((resolve) => {
            resolve(value);
        });
        const ref = asyncRef(promiseValue);

        expect(ref.value).toBe(null);

        await promiseValue;

        expect(ref.value).toBe(value)
    });

    it("should set value with new value correct when it's set with a promise", async () => {
        const initialValue = "test"
        const ref = asyncRef(initialValue);

        const newValue = "new";
        const newPromiseValue = new Promise((resolve) => {
            resolve(newValue);
        });

        ref.value = newPromiseValue;
        expect(ref.value).toBe(initialValue);

        await newPromiseValue;
        expect(ref.value).toBe(newValue);
    });

    it("should set value with new value instantly when newValue is not a Promise", async () => {
        const initialValue = "test"
        const ref = asyncRef(initialValue);

        expect(ref.value).toBe(initialValue);

        const newValue = "new";
        ref.value = newValue;

        expect(ref.value).toBe(newValue);
    });

    it("should return null when initial value will be rejected and call onReject", async () => {
        const onReject = vi.fn();
        const value = "test";
        const promise = new Promise((_, reject) => {
            reject("Error");
        });

        const ref = asyncRef(promise, onReject);
        await expect(promise).rejects.toThrowError("Error");
        expect(ref.value).toBeNull()
        expect(onReject).toHaveBeenCalledWith("Error");
    });

    it("should return null when setting with promise that will be rejected after an initial value is set and calls onReject", async () => {
        const onReject = vi.fn();
        const initialValue = "test"
        const ref = asyncRef(initialValue, onReject);

        const newPromiseValue = new Promise((_, reject) => {
            reject("Error");
        });

        ref.value = newPromiseValue;
        expect(ref.value).toBe(initialValue);

        await expect(newPromiseValue).rejects.toThrowError("Error");
        expect(ref.value).toBeNull();
        expect(onReject).toHaveBeenCalledWith("Error");
    });
});
