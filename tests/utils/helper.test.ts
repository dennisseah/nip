import { expect } from "chai";
import { Helper } from "../../src/utils/helper";

describe("Helper unit test", function () {
    this.timeout(4000);

    it("sleep for 3 seconds", async () => {
        const start = new Date().getTime();
        await Helper.sleep(3000);
        const end = new Date().getTime();
        expect(end - start).greaterThanOrEqual(3000);
    });
});
