export const reverseLookup = `
    import FIND from 0x097bafa4e0b48eef;

    pub fun main(input: Address): String? {
        return FIND.reverseLookup(input)
    }
`;
