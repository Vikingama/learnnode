var should = chai.should();

describe("simple test", function() {
    it("should equal 0 when n === 0", function() {
        window.fbnq(0).should.equal(0);
    });
});
