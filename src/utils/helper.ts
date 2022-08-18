/**
 * General helper class that provides utility functions
 */
export class Helper {
    public static sleep(ms: number): Promise<void> {
        return new Promise(
            (resolve): NodeJS.Timeout => setTimeout(resolve, ms)
        );
    }
}
