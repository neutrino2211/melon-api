const std = @import("std");
const testing = std.testing;

const RounderZig = struct {
    k1: u32,
    k2: u32,
    inbetween: u32,

    rand: std.rand.Xoshiro256,

    pub fn init(k1: u32, k2: u32) *RounderZig {
        var r = RounderZig{ .k1 = k1, .k2 = k2, .inbetween = 0, .rand = std.rand.DefaultPrng.init(0) };
        return &r;
    }

    pub fn next(rounder: *RounderZig) void {
        rounder.inbetween = rounder.k1 ^ rounder.k2;
        rounder.rand = std.rand.DefaultPrng.init(rounder.inbetween);
        rounder.inbetween = rounder.rand.random().int(u32);
        rounder.inbetween = rounder.inbetween ^ rounder.k2;
        rounder.k2 = rounder.inbetween;
        rounder.k1 = rounder.k1 ^ rounder.k2;
    }

    pub fn get_factor(rounder: *RounderZig) u32 {
        return rounder.inbetween;
    }
};

pub export fn add(a: i32, b: i32) i32 {
    return a + b;
}

pub export fn create_instance(k1: u32, k2: u32) *RounderZig {
    var rounder = RounderZig.init(k1, k2);

    return rounder;
}

pub export fn rounder_next(rounder: *RounderZig) void {
    rounder.next();
}

pub export fn rouder_get_factor(rounder: *RounderZig) u32 {
    return rounder.get_factor();
}

test "basic add functionality" {
    try testing.expect(add(3, 7) == 10);
}

test "create instance" {
    const instance = create_instance(123456, 7891011);
    try testing.expect(@intFromPtr(instance) != 0);
}

test "initial factor should be 0" {
    const instance = create_instance(123456, 7891011);
    try testing.expect(instance.get_factor() == 0);
}

test "factor after calling next must not be zero" {
    const instance = create_instance(123456, 7891011);
    instance.next();
    try testing.expect(instance.get_factor() != 0);
}

test "two following factors must not be the same" {
    const instance = create_instance(123456, 7891011);
    instance.next();
    const first = instance.get_factor();
    instance.next();
    const second = instance.get_factor();
    try testing.expect(first != 0);
    try testing.expect(first != second);
}
