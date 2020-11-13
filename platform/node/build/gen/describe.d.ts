import { Inspect } from "../lib/inspect";
export type { Inspect };
export declare type Plan = {
    actual: unknown;
    expected?: unknown;
    given?: string;
    should?: string;
    value?: unknown;
    message?: string;
};
export interface Assert {
    (plan: Plan): void;
    not(plan: Plan): void;
}
interface NativeAssert {
    (actual: unknown, expected: unknown, msg?: string): void;
}
export interface TestImplementation {
    ({ assert, inspect }: {
        assert: Assert;
        inspect: Inspect;
    }): Promise<void> | void;
}
export declare function describe(prefix: string, implementation: TestImplementation): Promise<void>;
export declare function makeAssert(assert: NativeAssert): (plan: Plan | Promise<Plan>) => Promise<void>;
