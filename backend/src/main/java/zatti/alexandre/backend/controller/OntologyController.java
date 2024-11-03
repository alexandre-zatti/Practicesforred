package zatti.alexandre.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import zatti.alexandre.backend.dto.*;
import zatti.alexandre.backend.model.Pratica;
import zatti.alexandre.backend.service.OntologyService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;

@RestController
@RequestMapping("/backend/api/ontology")
public class OntologyController {

    private final OntologyService ontologyService;

    @Autowired
    public OntologyController(OntologyService ontologyService) {
        this.ontologyService = ontologyService;
    }

    @PostMapping("/load")
    public ResponseEntity<String> loadOntology(@RequestParam("file") MultipartFile file) {
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }

            if (ontologyService.loadRdfData(sb.toString())) {
                return new ResponseEntity<>("Data loaded successfully using NEW CLUSTER.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Error loading data.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error loading data: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/fase-engenharia/consequencia")
    public ResponseEntity<List<FaseEngenhariaConsequenciasResponseDTO>> getConsequenciasByFaseEngenharia() {
        List<FaseEngenhariaConsequenciasResponseDTO> resultList = ontologyService.getConsequenciasByFaseEngenharia();

        if (!resultList.isEmpty()) {
            return new ResponseEntity<>(resultList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(resultList, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/consequencia/causas")
    public ResponseEntity<List<ConsequenciaCausasResponseDTO>> getCausasByConsequencia(
            @RequestBody List<ConsequenciaCausasRequestDTO> consequencias) {

        return new ResponseEntity<>(ontologyService.getCausasByConsequencia(consequencias), HttpStatus.OK);
    }

    @PostMapping("/consequencia/relevancia")
    public ResponseEntity<List<RelevanciaConsequenciaResponseDTO>> calculateRelevanciaConsequencia(
            @RequestBody List<RelevanciaConsequenciaRequestDTO> consequencias) {
        return new ResponseEntity<>(ontologyService.calculateRelevanciaConsequencia(consequencias), HttpStatus.OK);
    }

    @PostMapping("/causa/praticas")
    public ResponseEntity<List<CausaPraticasResponseDTO>> getPraticasByCausa(
            @RequestBody List<CausaPraticasRequestDTO> causas) {
        return new ResponseEntity<>(ontologyService.getPraticasByCausa(causas), HttpStatus.OK);
    }

    @GetMapping("/pratica/termos")
    public ResponseEntity<List<TermosPraticaResponseDTO>> getTermosByPratica(@RequestParam(value = "praticaUri") String praticaUri) {
        List<TermosPraticaResponseDTO> resultList = ontologyService.getTermosPratica(praticaUri);

        return new ResponseEntity<>(resultList, HttpStatus.OK);
    }

    @GetMapping("/pratica/causas-consequencias")
    public ResponseEntity<List<ConsequenciaCausasResponseDTO>> getCausasConsequenciasByPratica(@RequestParam(value = "praticaUri") String praticaUri) {
        List<ConsequenciaCausasResponseDTO> resultList = ontologyService.getCausasConsequenciasByPratica(praticaUri);

        return new ResponseEntity<>(resultList, HttpStatus.OK);
    }

    @GetMapping("/pratica")
    public ResponseEntity<Pratica> getPratica(@RequestParam(value = "praticaUri") String praticaUri) {
        Pratica result = ontologyService.getPratica(praticaUri);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
