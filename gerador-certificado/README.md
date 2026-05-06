# Gerador de Certificado TEA (Standalone)

Este é o programa de geração de certificado extraído da área de membros.

## Como usar

1.  **Dependências**: Certifique-se de ter as seguintes bibliotecas instaladas no seu projeto React:
    ```bash
    npm install html2canvas lucide-react
    ```

2.  **Arquivos**:
    *   `App.jsx`: Contém toda a lógica, estilos e layout do gerador.
    *   `assets/template.png`: A imagem de fundo do certificado.

3.  **Funcionamento**:
    *   O componente é totalmente autônomo.
    *   O estilo foi movido para dentro do componente (`styles`) para evitar conflitos com outros CSS.
    *   O download gera um arquivo PNG de alta resolução (3x).

4.  **Personalização**:
    *   Para mudar o nome da educadora, altere a variável `educatorName` no topo do componente.
    *   Para mudar a fonte, o componente tenta usar a 'Outfit', mas reverte para a fonte do sistema se não estiver disponível.
