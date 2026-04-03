package zatti.alexandre.backend.enums;

public enum ClassificacaoPratica {
    ESPECIFICA("Específica"),
    COMUM("Comum"),
    GERAL("Geral");

    private final String value;

    ClassificacaoPratica(String value) {
        this.value = value;
    }

    public static ClassificacaoPratica fromValue(String value) {
        for (ClassificacaoPratica enumValue : ClassificacaoPratica.values()) {
            if (enumValue.value.equals(value)) {
                return enumValue;
            }
        }
        throw new IllegalArgumentException("No enum constant with value: " + value);
    }

    public String getValue() {
        return value;
    }
}
