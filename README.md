<div align="center">

# Hi, I'm Oscar 🧬

### Biology · Computing · Systems

**Oscar Alexis Quintero López** · Bioinformatician · Bogotá, Colombia 🇨🇴

From sequences to systems: code to explore life.

[![Website](https://img.shields.io/badge/oquinterol.com-070a09?style=for-the-badge&logoColor=white)](https://oquinterol.com)
[![ORCID](https://img.shields.io/badge/ORCID-A6CE39?style=for-the-badge&logo=orcid&logoColor=black)](https://orcid.org/0000-0001-8926-6400)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logoColor=white)](https://www.linkedin.com/in/oquinterol/)
[![Contact](https://img.shields.io/badge/Let's_talk-3D7A6A?style=for-the-badge&logo=gmail&logoColor=white)](mailto:oquinterol@unal.edu.co)

</div>

---

## 🔬 Between the lab bench and the terminal

I work on **genomics, systems biology, and computational reproducibility**. I build analysis workflows and tools that turn biological data into results that can be explored, understood, and reproduced.

- **Genomes and transcriptomes:** assembly, annotation, and sequencing data analysis.
- **Metabolism as a system:** genome-scale metabolic model reconstruction and flux analysis.
- **Reproducible science:** version-controlled code, isolated environments, and automated workflows.
- **Open tools:** applications that connect lab questions with computational solutions.

I hold an **M.Sc. in Bioinformatics** from the National University of Colombia and a **Bachelor's degree in Biology** from Francisco José de Caldas District University.

## 🛠️ My toolbox

| Area                          | Tools                                                                     |
| :---------------------------- | :------------------------------------------------------------------------ |
| Programming and data          | `Python` · `R` · `Bash` · `SQL` · `Jupyter`                               |
| Bioinformatics                | `RNA-seq` · `BLAST+` · `BWA/Bowtie2` · `BUSCO` · `FastQC/MultiQC`         |
| Systems biology               | `COBRApy` · `SBML` · `KEGG` · `MEMOTE` · `FBA/FVA`                        |
| Reproducibility and computing | `Git` · `Snakemake` · `Nextflow` · `Conda` · `Docker` · `Linux` · `SLURM` |

## 🌱 Projects to explore

| Project                                                                                | What it's about                                                                                                                                                                     |
| :------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🧬 **[Vector editor](https://github.com/oquinterol/vector-editor)**                    | Simulate cloning, digestion, and ligation, and explore the resulting plasmid without your sequences ever leaving the browser. **[Try it ↗](https://vector-editor.oquinterol.com/)** |
| 🤖 **[GenomeAgent](https://github.com/oquinterol/Agentic-Bioinformatician)**           | An agent that explores genome assembly strategies under resource constraints, with validation and provenance tracking. **Under active development.**                                |
| 🥔 **[Criolla potato genomics](https://oquinterol.com/en/research/phureja-genome/)**   | My master's thesis: genome assembly and annotation of the Colombia variety and reconstruction of a metabolic model.                                                                 |
| 🧪 **[RNA-seq pipeline](https://oquinterol.com/en/research/phureja-rnaseq-pipeline/)** | My undergraduate thesis: an RNA-seq analysis workflow for criolla potato.                                                                                                           |

More research, tools, and notes at **[oquinterol.com](https://oquinterol.com)**, in English and Spanish.

## ☕ Let's talk

Working on genomics, metabolic models, or research tools? **[Get in touch](mailto:oquinterol@unal.edu.co)**.

[My record on ORCID](https://orcid.org/0000-0001-8926-6400) · [Connect on LinkedIn](https://www.linkedin.com/in/oquinterol/)

---

<details>
<summary><strong>💻 About this repository: my personal website</strong></summary>

Besides this profile README, this repository holds the code for **[oquinterol.com](https://oquinterol.com)**, built with Astro. The site deploys automatically to GitHub Pages from `main` through GitHub Actions.

### Local development

Use Node.js 22 and pnpm 11.2.2, the same versions as the deployment workflow.

```bash
pnpm install
pnpm dev
```

### Validation and build

```bash
pnpm run format:check
pnpm run lint:check
pnpm run build
pnpm run verify:site
```

</details>
