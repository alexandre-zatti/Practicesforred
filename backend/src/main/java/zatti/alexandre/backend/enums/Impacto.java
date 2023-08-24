package zatti.alexandre.backend.enums;

public enum Impacto {
    LEVE(0),
    MODERADO(1),
    CRITICO(2);

    private final int value;

    Impacto(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
