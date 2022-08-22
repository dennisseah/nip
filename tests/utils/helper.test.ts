import { expect } from "chai";
import { Helper } from "../../src/utils/helper";

describe("Helper unit test", function () {
    it("sleep for 0.5 seconds", async () => {
        const start = new Date().getTime();
        await Helper.sleep(500);
        const end = new Date().getTime();
        expect(end - start).greaterThanOrEqual(500);
    });
});
