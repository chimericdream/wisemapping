describe("Functions suite test", () => {
    it("$defined() test spec", () => {
        let testVariable = undefined;
        expect($defined(testVariable)).toBe(false);
        testVariable = 1;
        expect($defined(testVariable)).toBe(true);
        testVariable = null;
        expect($defined(testVariable)).toBe(false);
    });
});
