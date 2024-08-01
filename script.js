document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const xmlString = e.target.result;
            processXML(xmlString);
        };
        reader.readAsText(file);
    }
});

function processXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // Função para extrair texto de um elemento
    const getText = (element, tag) => element.getElementsByTagName(tag)[0]?.textContent || 'N/A';

    // Extrair informações do CF-e
    const emitente = xmlDoc.getElementsByTagName("emit")[0];
    const ide = xmlDoc.getElementsByTagName("ide")[0];
    const total = xmlDoc.getElementsByTagName("ICMSTot")[0];
    const pgto = xmlDoc.getElementsByTagName("pgto")[0];
    const itens = xmlDoc.getElementsByTagName("det");

    const extratoDiv = document.getElementById("extrato");

    const emitenteHtml = `
        <h2>Extrato CF-e</h2>
        <h3>Emitente</h3>
        <p>Nome: ${getText(emitente, "xNome")}</p>
        <p>CNPJ: ${getText(emitente, "CNPJ")}</p>
        <p>Endereço: ${getText(emitente.getElementsByTagName("enderEmit")[0], "xLgr")}, ${getText(emitente.getElementsByTagName("enderEmit")[0], "nro")}</p>
        <p>Bairro: ${getText(emitente.getElementsByTagName("enderEmit")[0], "xBairro")}</p>
        <p>Cidade: ${getText(emitente.getElementsByTagName("enderEmit")[0], "xMun")}</p>
        <p>CEP: ${getText(emitente.getElementsByTagName("enderEmit")[0], "CEP")}</p>
        <p>IE: ${getText(emitente, "IE")}</p>
    `;

    const cfeHtml = `
        <h3>Dados do CF-e</h3>
        <p>Extrato Nº: ${getText(ide, "nCFe")}</p>
        <p>Data e Hora: ${getText(ide, "dEmi")} ${getText(ide, "hEmi")}</p>
        <p>Caixa: ${getText(ide, "numeroCaixa")}</p>
    `;

    let itensHtml = `
        <h3>Itens</h3>
        <table>
            <thead>
                <tr>
                    <th>COD</th>
                    <th>DESCRIÇÃO</th>
                    <th>QTD</th>
                    <th>UN</th>
                    <th>VL UN R$</th>
                    <th>VL ITEM R$</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < itens.length; i++) {
        const prod = itens[i].getElementsByTagName("prod")[0];
        itensHtml += `
            <tr>
                <td>${getText(prod, "cProd")}</td>
                <td>${getText(prod, "xProd")}</td>
                <td>${getText(prod, "qCom")}</td>
                <td>${getText(prod, "uCom")}</td>
                <td>${getText(prod, "vUnCom")}</td>
                <td>${getText(prod, "vProd")}</td>
            </tr>
        `;
    }

    itensHtml += `
            </tbody>
        </table>
    `;

    const totaisHtml = `
        <h3>Totais</h3>
        <p>Valor Total: R$ ${getText(total, "vProd")}</p>
        <p>Desconto: R$ ${getText(total, "vDesc")}</p>
        <p>Valor Pago: R$ ${getText(pgto.getElementsByTagName("MP")[0], "vMP")}</p>
        <p>Troco: R$ ${getText(pgto, "vTroco")}</p>
    `;

    const observacoesHtml = `
        <h3>Observações do Contribuinte</h3>
        <p>Total de tributos conforme Lei 12.741/2012: R$ ${getText(total, "vOutro")}</p>
    `;

    const satHtml = `
        <h3>SAT</h3>
        <p>SAT No: ${getText(ide, "nserieSAT")}</p>
        <p>Data e Hora: ${getText(ide, "dEmi")} ${getText(ide, "hEmi")}</p>
    `;

    extratoDiv.innerHTML = emitenteHtml + cfeHtml + itensHtml + totaisHtml + observacoesHtml + satHtml;
}
