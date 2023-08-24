package zatti.alexandre.backend.enums;

public enum ClassificacaoPratica {
    ESPEFICIFICA("Específica"),
    COMUM("Comum"),
    GERAL("Geral");

    private final String value;

    ClassificacaoPratica(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
