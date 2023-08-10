package zatti.alexandre.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import zatti.alexandre.backend.model.FaseEngenharia;
import zatti.alexandre.backend.service.OntologyService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;

@RestController
@RequestMapping("/api/ontology")
public class OntologyController {

    private final OntologyService ontologyService;

    @Autowired
    public OntologyController(OntologyService ontologyService) {
        this.ontologyService = ontologyService;
    }

    @PostMapping("/load")
    public ResponseEntity<String> loadRdf(@RequestParam("file") MultipartFile file) {
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }

            if (ontologyService.loadRdfData(sb.toString())) {
                return new ResponseEntity<>("Data loaded successfully.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Error loading data.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error loading data: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/fase-engenharia/consequencia")
    public ResponseEntity<List<FaseEngenharia>> getData() {
        List<FaseEngenharia> resultList = ontologyService.getFaseEngenhariaData();

        if (!resultList.isEmpty()) {
            return new ResponseEntity<>(resultList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(resultList, HttpStatus.NOT_FOUND);
        }
    }
}
