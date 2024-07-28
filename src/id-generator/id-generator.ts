export class IdGenerator {
    private counter = 0;

    generate(): number {
        return this.counter++;
    }
}
