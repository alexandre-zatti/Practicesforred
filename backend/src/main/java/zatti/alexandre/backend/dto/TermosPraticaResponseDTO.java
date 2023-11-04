package zatti.alexandre.backend.dto;

public sealed interface TermosPraticaResponseDTO permits TermoPraticaDTO, TermoPraticaAtividadeDTO,
        TermoPraticaProdutoDTO,
        TermoPraticaAlphaDTO {
}
