import { Inspect } from "../lib/inspect";
export declare type Plan<A> = {
    actual: unknown;
    expected: A;
    given?: string;
    should?: string;
    value?: unknown;
    message?: string;
    not?: boolean;
};
export declare type Assert = {
    <A>(plan: Plan<A>): void;
    not<A>(plan: Plan<A>): void;
};
export declare type AssertFunction = {
    (actual: unknown, expected: unknown, msg?: string): void;
};
export declare type TestImplementation = ({ assert, inspect, }: {
    assert: Assert;
    inspect: Inspect;
}) => Promise<void> | void;
export declare const describe: (prefix: string, implementation: ({ assert, inspect, }: {
    assert: Assert;
    inspect: Inspect;
}) => Promise<void> | void) => Promise<void>;
export declare const makeAssert: (assert: AssertFunction) => <A>({ actual, expected, value, given, should, message, }: Plan<A>) => Promise<void>;
