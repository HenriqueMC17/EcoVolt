# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: conversion.spec.ts >> Landing Page — Hero & Navigation >> should render the H1 heading
- Location: e2e\conversion.spec.ts:26:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5] [cursor=pointer]:
          - img [ref=e7]
          - generic [ref=e12]:
            - generic [ref=e13]:
              - generic [ref=e14]: ECO
              - generic [ref=e15]: VOLT
            - generic [ref=e18]: Enterprise
        - generic [ref=e19]:
          - link "Início" [ref=e20] [cursor=pointer]:
            - /url: "#"
          - link "Solução" [ref=e21] [cursor=pointer]:
            - /url: "#solucao"
          - link "Como Funciona" [ref=e22] [cursor=pointer]:
            - /url: "#como-funciona"
          - link "Plataforma" [ref=e23] [cursor=pointer]:
            - /url: "#plataforma"
          - link "Benefícios" [ref=e24] [cursor=pointer]:
            - /url: "#beneficios"
          - link "Contato" [ref=e25] [cursor=pointer]:
            - /url: "#contato"
        - link "Solicitar Demonstração" [ref=e28] [cursor=pointer]:
          - /url: /solicitar-demonstracao
          - button "Solicitar Demonstração" [ref=e29]:
            - generic [ref=e31]: Solicitar Demonstração
    - generic [ref=e33]:
      - generic [ref=e35]:
        - generic [ref=e37]:
          - generic [ref=e42]: Trusted by Global Tech Hubs
          - generic [ref=e44]: "Scale: Zero Carbon"
        - heading "Energia para a próxima escala." [level=1] [ref=e45]:
          - text: Energia para a
          - text: próxima escala.
        - paragraph [ref=e46]:
          - text: A infraestrutura crítica que converte sustentabilidade em
          - text: eficiência financeira real para grandes operações.
        - generic [ref=e47]:
          - button "Agendar Trial" [ref=e48]:
            - generic [ref=e49]:
              - text: Agendar Trial
              - img [ref=e50]
          - button "Documentação" [ref=e52]:
            - generic [ref=e53]: Documentação
        - generic [ref=e56]:
          - generic [ref=e57]:
            - generic [ref=e63]:
              - img [ref=e64]
              - text: secure.ecovolt.cloud
            - generic [ref=e67]:
              - img [ref=e68]
              - generic [ref=e71]: X-GRID ENGINE
          - generic [ref=e72]:
            - generic [ref=e73]:
              - generic [ref=e74] [cursor=pointer]:
                - generic [ref=e75]:
                  - img [ref=e77]
                  - generic [ref=e79]: 99.9%
                - generic [ref=e80]:
                  - paragraph [ref=e81]: Grid Status
                  - paragraph [ref=e82]: Optimal
              - generic [ref=e83] [cursor=pointer]:
                - generic [ref=e84]:
                  - img [ref=e86]
                  - generic [ref=e88]: "-2.4%"
                - generic [ref=e89]:
                  - paragraph [ref=e90]: Realtime Load
                  - paragraph [ref=e91]: 482.4 kW
              - generic [ref=e92] [cursor=pointer]:
                - generic [ref=e93]:
                  - img [ref=e95]
                  - generic [ref=e98]: Active
                - generic [ref=e99]:
                  - paragraph [ref=e100]: Net Zero Index
                  - paragraph [ref=e101]: "1.00"
              - generic [ref=e102] [cursor=pointer]:
                - generic [ref=e103]:
                  - img [ref=e105]
                  - generic [ref=e107]: Live
                - generic [ref=e108]:
                  - paragraph [ref=e109]: Revenue Delta
                  - paragraph [ref=e110]: +12.4%
            - generic [ref=e111]:
              - generic [ref=e112]:
                - generic [ref=e113]:
                  - heading "Active Load Topology" [level=4] [ref=e114]
                  - paragraph [ref=e115]: Análise preditiva de demanda energética em milissegundos.
                - generic [ref=e116]:
                  - generic [ref=e117]: Global
                  - generic [ref=e118]: Live Nodes
              - generic "Consumo Matrix" [ref=e119]
      - generic [ref=e154]:
        - paragraph [ref=e155]: Transformando a Matriz Energética de Gigantes Globais
        - generic [ref=e156]:
          - generic [ref=e157]:
            - generic [ref=e158]: G
            - generic [ref=e159]: Global Events
          - generic [ref=e160]:
            - generic [ref=e161]: L
            - generic [ref=e162]: Live Nation
          - generic [ref=e163]:
            - generic [ref=e164]: R
            - generic [ref=e165]: Rock in Rio
          - generic [ref=e166]:
            - generic [ref=e167]: L
            - generic [ref=e168]: Lollapalooza
          - generic [ref=e169]:
            - generic [ref=e170]: C
            - generic [ref=e171]: Coachella
          - generic [ref=e172]:
            - generic [ref=e173]: T
            - generic [ref=e174]: Tomorrowland
        - generic [ref=e175]:
          - generic [ref=e176]:
            - generic [ref=e177]: 1.2GW
            - generic [ref=e178]: Energia Gerida
          - generic [ref=e180]:
            - generic [ref=e181]: 500+
            - generic [ref=e182]: Eventos Globais
          - generic [ref=e184]:
            - generic [ref=e185]: 99.9%
            - generic [ref=e186]: Uptime Garantido
    - generic [ref=e190]:
      - generic [ref=e191]:
        - generic [ref=e192]: The Problem
        - heading "O status quo do setor é insustentável." [level=2] [ref=e193]:
          - text: O status quo do setor é
          - text: insustentável.
        - paragraph [ref=e194]: Organizadores ainda lidam com estimativas manuais, sistemas arcaicos e absoluta falta de transparência sobre o impacto ambiental real.
      - generic [ref=e195]:
        - generic [ref=e196]:
          - img [ref=e198]
          - generic [ref=e203]:
            - heading "Instabilidade Energética" [level=3] [ref=e204]
            - paragraph [ref=e205]: Quedas inesperadas de energia podem custar milhões e destruir a reputação de um grande evento.
        - generic [ref=e206]:
          - img [ref=e208]
          - generic [ref=e210]:
            - heading "Opacidade Financeira" [level=3] [ref=e211]
            - paragraph [ref=e212]: Faturas complexas e reconciliação manual impossibilitam a auditoria precisa de gastos pós-evento.
        - generic [ref=e213]:
          - img [ref=e215]
          - generic [ref=e217]:
            - heading "Desperdício 'Verde'" [level=3] [ref=e218]
            - paragraph [ref=e219]: Pagar por certificados de energia renovável que não garantem o uso real de fontes limpas na carga total.
    - generic [ref=e222]:
      - generic [ref=e224]:
        - generic [ref=e225]: THE BUSINESS CASE
        - heading "Por que diretores de operações escolhem a ECOVOLT." [level=2] [ref=e226]
        - paragraph [ref=e227]: Unimos sustentabilidade e performance financeira para transformar custos variáveis em ativos estratégicos gerenciáveis.
      - generic "Lista de Benefícios Corporativos" [ref=e228]:
        - generic [ref=e231]:
          - generic [ref=e232]:
            - img [ref=e234]
            - img [ref=e237]
          - generic [ref=e240]:
            - heading "Risco Regulatório Zero" [level=3] [ref=e241]
            - paragraph [ref=e242]: Conformidade total e automática com normas ESG e certificações de energia renovável via Smart Contracts auditáveis.
        - generic [ref=e246]:
          - generic [ref=e247]:
            - img [ref=e249]
            - img [ref=e252]
          - generic [ref=e255]:
            - heading "Economia Inteligente" [level=3] [ref=e256]
            - paragraph [ref=e257]: Reduza custos fixos em até 30% com algoritmos de IA que otimizam a distribuição térmica e elétrica.
        - generic [ref=e261]:
          - generic [ref=e262]:
            - img [ref=e264]
            - img [ref=e267]
          - generic [ref=e270]:
            - heading "Escala Sem Fronteiras" [level=3] [ref=e271]
            - paragraph [ref=e272]: Ative infraestrutura energética em qualquer localidade com nossa rede global de provedores homologados.
        - generic [ref=e276]:
          - generic [ref=e277]:
            - img [ref=e279]
            - img [ref=e281]
          - generic [ref=e284]:
            - heading "Transparência Total" [level=3] [ref=e285]
            - paragraph [ref=e286]: Reconciliação em tempo real e fechamento fiscal instantâneo. Elimine erros de faturamento pós-evento.
    - generic [ref=e290]:
      - generic [ref=e292]:
        - generic [ref=e293]: EcoVolt OS
        - heading "A arquitetura que domina a complexidade." [level=2] [ref=e294]
        - paragraph [ref=e295]: Interface unificada para monitoramento de carga crítica, automação preditiva e governança de dados renováveis.
      - generic [ref=e296]:
        - generic [ref=e297]:
          - generic [ref=e298]:
            - generic [ref=e301]: Live Grid Monitoring
            - generic [ref=e304]: "Edge Node: Beta-7"
          - generic [ref=e305]:
            - generic [ref=e306]: "Status: Operational"
            - generic [ref=e307]: L-99.9
        - generic [ref=e311]:
          - generic [ref=e312]:
            - generic [ref=e317]:
              - img [ref=e318]
              - generic [ref=e320]: secure.ecovolt.enterprise
            - generic [ref=e321]:
              - generic [ref=e322]:
                - generic [ref=e323]: Last Sync
                - generic [ref=e324]: 0.04ms ago
              - img [ref=e326]
          - generic [ref=e329]:
            - generic [ref=e330]:
              - img [ref=e332] [cursor=pointer]
              - img [ref=e335] [cursor=pointer]
              - img [ref=e338] [cursor=pointer]
              - img [ref=e341] [cursor=pointer]
              - img [ref=e344] [cursor=pointer]
              - img [ref=e348] [cursor=pointer]
            - generic [ref=e350]:
              - generic [ref=e351]:
                - generic [ref=e352]:
                  - generic [ref=e353]:
                    - generic [ref=e354]: REALTIME
                    - generic [ref=e355]: Infrastructure Health
                  - heading "Event Performance Matrix" [level=3] [ref=e356]
                - generic [ref=e357]:
                  - generic [ref=e358]:
                    - generic [ref=e359]: Peak Load
                    - generic [ref=e360]: 482.4 kV
                  - generic [ref=e361]:
                    - generic [ref=e362]: Efficiency
                    - generic [ref=e363]: 99.8%
              - generic [ref=e364]:
                - generic [ref=e367] [cursor=pointer]:
                  - generic [ref=e368]:
                    - img [ref=e369]
                    - generic [ref=e371]: 84%
                  - generic [ref=e373]: Storage Capacity
                - generic [ref=e377] [cursor=pointer]:
                  - generic [ref=e378]:
                    - img [ref=e379]
                    - generic [ref=e382]: 92%
                  - generic [ref=e384]: Active Nodes
                - generic [ref=e388] [cursor=pointer]:
                  - generic [ref=e389]:
                    - img [ref=e390]
                    - generic [ref=e392]: 98%
                  - generic [ref=e394]: Sustainability Score
              - generic [ref=e396]:
                - generic [ref=e397]:
                  - heading "Active Load Logs" [level=4] [ref=e398]
                  - button "Full Diagnostics" [ref=e399]:
                    - text: Full Diagnostics
                    - img [ref=e400]
                - generic [ref=e402]:
                  - generic [ref=e403]:
                    - generic [ref=e404]:
                      - generic [ref=e405]: "1"
                      - generic [ref=e406]:
                        - generic [ref=e407]: São Paulo Data Center
                        - generic [ref=e408]: SP-EAST-01
                    - generic [ref=e409]:
                      - generic [ref=e410]:
                        - generic [ref=e411]: Consumption
                        - generic [ref=e412]: 12.4 MW/h
                      - generic [ref=e413]: "STATUS: OPTIMAL"
                  - generic [ref=e414]:
                    - generic [ref=e415]:
                      - generic [ref=e416]: "2"
                      - generic [ref=e417]:
                        - generic [ref=e418]: London Tech Summit
                        - generic [ref=e419]: LDN-HUB-V2
                    - generic [ref=e420]:
                      - generic [ref=e421]:
                        - generic [ref=e422]: Consumption
                        - generic [ref=e423]: 4.2 MW/h
                      - generic [ref=e424]: "STATUS: OPTIMAL"
                  - generic [ref=e425]:
                    - generic [ref=e426]:
                      - generic [ref=e427]: "3"
                      - generic [ref=e428]:
                        - generic [ref=e429]: Tokyo Smart City
                        - generic [ref=e430]: TKY-NORTH-8
                    - generic [ref=e431]:
                      - generic [ref=e432]:
                        - generic [ref=e433]: Consumption
                        - generic [ref=e434]: 8.9 MW/h
                      - generic [ref=e435]: "STATUS: OPTIMAL"
    - generic [ref=e438]:
      - generic [ref=e440]:
        - generic [ref=e441]: THE BENCHMARK
        - heading "EcoVolt vs Métodos Tradicionais." [level=2] [ref=e442]:
          - text: EcoVolt vs
          - text: Métodos Tradicionais.
        - paragraph [ref=e443]: Pare de gastar com energia que sua infraestrutura não consome. Veja por que somos a escolha lógica para grandes operações.
      - generic [ref=e444]:
        - generic [ref=e445]:
          - generic [ref=e446]:
            - generic [ref=e447]:
              - img [ref=e449]
              - heading "Tradicionais" [level=3] [ref=e454]
            - list [ref=e455]:
              - listitem [ref=e456]:
                - img [ref=e457]
                - generic [ref=e460]: Custos ocultos no faturamento
              - listitem [ref=e461]:
                - img [ref=e462]
                - generic [ref=e465]: Falta de dados para ESG
              - listitem [ref=e466]:
                - img [ref=e467]
                - generic [ref=e470]: Desperdícios operacionais
              - listitem [ref=e471]:
                - img [ref=e472]
                - generic [ref=e475]: Risco de multas ambientais
          - generic [ref=e476]:
            - generic [ref=e479]:
              - img [ref=e481]
              - heading "Vantagem EcoVolt" [level=3] [ref=e483]
            - list [ref=e484]:
              - listitem [ref=e485]:
                - img [ref=e486]
                - generic [ref=e488]: ROI imediato via eficiência
              - listitem [ref=e489]:
                - img [ref=e490]
                - generic [ref=e492]: Certificação automática
              - listitem [ref=e493]:
                - img [ref=e494]
                - generic [ref=e496]: Monitoramento preditivo 24/7
              - listitem [ref=e497]:
                - img [ref=e498]
                - generic [ref=e500]: Interface unificada
        - generic [ref=e501]:
          - table [ref=e503]:
            - rowgroup [ref=e504]:
              - row "Recurso Principal EcoVolt OS Impacto Direto" [ref=e505]:
                - columnheader "Recurso Principal" [ref=e506]
                - columnheader "EcoVolt OS" [ref=e507]
                - columnheader "Impacto Direto" [ref=e508]
            - rowgroup [ref=e509]:
              - row "Visibilidade de Consumo Tempo Real (Live Dash) Prevenção de sobrecarga" [ref=e510]:
                - cell "Visibilidade de Consumo" [ref=e511]:
                  - paragraph [ref=e512]: Visibilidade de Consumo
                - cell "Tempo Real (Live Dash)" [ref=e513]:
                  - paragraph [ref=e514]: Tempo Real (Live Dash)
                - cell "Prevenção de sobrecarga" [ref=e515]:
                  - paragraph [ref=e517]: Prevenção de sobrecarga
              - row "Eficiência Energética Alta (Otimização via IA) Redução de custos reais" [ref=e518]:
                - cell "Eficiência Energética" [ref=e519]:
                  - paragraph [ref=e520]: Eficiência Energética
                - cell "Alta (Otimização via IA)" [ref=e521]:
                  - paragraph [ref=e522]: Alta (Otimização via IA)
                - cell "Redução de custos reais" [ref=e523]:
                  - paragraph [ref=e525]: Redução de custos reais
              - row "Conformidade ESG Automatizada / Smart Contract Selo de Sustentabilidade" [ref=e526]:
                - cell "Conformidade ESG" [ref=e527]:
                  - paragraph [ref=e528]: Conformidade ESG
                - cell "Automatizada / Smart Contract" [ref=e529]:
                  - paragraph [ref=e530]: Automatizada / Smart Contract
                - cell "Selo de Sustentabilidade" [ref=e531]:
                  - paragraph [ref=e533]: Selo de Sustentabilidade
              - row "Riscos Operacionais Resiliência Digital 24/7 Continuidade Absoluta" [ref=e534]:
                - cell "Riscos Operacionais" [ref=e535]:
                  - paragraph [ref=e536]: Riscos Operacionais
                - cell "Resiliência Digital 24/7" [ref=e537]:
                  - paragraph [ref=e538]: Resiliência Digital 24/7
                - cell "Continuidade Absoluta" [ref=e539]:
                  - paragraph [ref=e541]: Continuidade Absoluta
          - generic [ref=e542] [cursor=pointer]:
            - generic [ref=e543]:
              - img [ref=e545]
              - generic [ref=e549]:
                - paragraph [ref=e550]: Guaranteed Performance
                - paragraph [ref=e551]: +35% Avg. Efficiency
            - generic [ref=e553]:
              - paragraph [ref=e554]: Faturamento Estimado
              - paragraph [ref=e555]:
                - text: Imediato
                - img [ref=e556]
    - generic [ref=e560]:
      - generic [ref=e562]:
        - generic [ref=e563]: OPERATIONAL FLOW
        - 'heading "Da estratégia ao faturamento: Totalmente integrado." [level=2] [ref=e564]':
          - text: "Da estratégia ao faturamento:"
          - text: Totalmente integrado.
      - generic [ref=e567]:
        - generic [ref=e569]:
          - generic [ref=e570]:
            - img [ref=e572]
            - generic [ref=e575]: "01"
          - generic [ref=e576]:
            - heading "Mapeamento Global" [level=3] [ref=e577]
            - paragraph [ref=e578]: Nossa IA analisa sua planta e mapeia provedores de energia limpa em qualquer coordenada do globo.
            - generic [ref=e581]: "Latency: < 40ms"
        - generic [ref=e583]:
          - generic [ref=e584]:
            - img [ref=e586]
            - generic [ref=e591]: "02"
          - generic [ref=e592]:
            - heading "Smart Contracts" [level=3] [ref=e593]
            - paragraph [ref=e594]: Fechamento automático com provedores via contratos inteligentes que blindam preço e conformidade.
            - generic [ref=e597]: Blockchain Verified
        - generic [ref=e599]:
          - generic [ref=e600]:
            - img [ref=e602]
            - generic [ref=e605]: "03"
          - generic [ref=e606]:
            - heading "Monitoramento Live" [level=3] [ref=e607]
            - paragraph [ref=e608]: Uma camada digital monitora cada kW consumido em tempo real durante toda a sua produção.
            - generic [ref=e611]: Real-time Stream
      - generic [ref=e612]:
        - generic [ref=e613]:
          - generic [ref=e614]:
            - img [ref=e615]
            - generic [ref=e617]: Compliance & precision
          - heading "Finishing with Extreme Precision." [level=3] [ref=e618]:
            - text: Finishing with
            - text: Extreme Precision.
          - paragraph [ref=e619]: Após o fechamento da operação, nossa reconciliação algorítmica emite auditorias técnicas e faturamento consolidado em segundos.
        - generic [ref=e620]:
          - img [ref=e624]
          - generic [ref=e626]:
            - generic [ref=e627]: Instant Reconciliation
            - generic [ref=e628]:
              - img [ref=e629]
              - generic [ref=e631]: "SLA: 0.04s Process"
    - generic [ref=e636]:
      - generic [ref=e637]:
        - generic [ref=e638]:
          - generic [ref=e639]: A Nossa Visão
          - heading "Digitalizar o futuro da energia para eventos." [level=2] [ref=e640]
          - paragraph [ref=e641]: Não somos apenas um marketplace. Somos a infraestrutura de governança que permite ao mercado escalar com 100% de conformidade ESG.
        - generic [ref=e642]:
          - generic [ref=e643]:
            - img [ref=e645]
            - heading "Escalabilidade" [level=4] [ref=e649]
            - paragraph [ref=e650]: Pronto para festivais e conferências globais.
          - generic [ref=e651]:
            - img [ref=e653]
            - heading "Trustless" [level=4] [ref=e656]
            - paragraph [ref=e657]: Rastreabilidade completa de cada kW consumido.
      - generic [ref=e660]:
        - generic [ref=e661]:
          - generic [ref=e662]:
            - generic [ref=e663]: "98"
            - generic [ref=e664]: "%"
          - paragraph [ref=e665]: Acurácia na Reconciliação
          - paragraph [ref=e666]: Nossos algoritmos eliminam discrepâncias financeiras entre o provisionado e o consumido, garantindo faturamento justo.
        - generic [ref=e668]:
          - generic [ref=e669]:
            - paragraph [ref=e670]: 2.4k
            - paragraph [ref=e671]: Toneladas CO2
          - generic [ref=e674]:
            - paragraph [ref=e675]: 500+
            - paragraph [ref=e676]: Provedores Cert.
    - generic [ref=e683]:
      - generic [ref=e685]:
        - generic [ref=e686]: THE ECOVOLT EDGE
        - heading "Onde a precisão encontra a sustentabilidade." [level=2] [ref=e687]:
          - text: Onde a precisão encontra a
          - text: sustentabilidade.
      - generic [ref=e688]:
        - generic [ref=e690]:
          - generic [ref=e692]: Niche Leader
          - img [ref=e694]
          - generic [ref=e698]:
            - heading "Eco-Specialized" [level=4] [ref=e699]
            - paragraph [ref=e700]: Foco absoluto no nicho de eventos, resolvendo dores específicas de produtores globais.
        - generic [ref=e702]:
          - generic [ref=e704]: All-in-one
          - img [ref=e706]
          - generic [ref=e710]:
            - heading "Stack Integrada" [level=4] [ref=e711]
            - paragraph [ref=e712]: Unimos estimativa, contratação e reconciliação em uma única API de alta disponibilidade.
        - generic [ref=e714]:
          - generic [ref=e716]: Realtime OS
          - img [ref=e718]
          - generic [ref=e720]:
            - heading "Visão Operacional" [level=4] [ref=e721]
            - paragraph [ref=e722]: Entregamos software de monitoramento real que de fato governa a carga energética do grid.
        - generic [ref=e724]:
          - generic [ref=e726]: Enterprise Ready
          - img [ref=e728]
          - generic [ref=e731]:
            - heading "Escalabilidade B2B" [level=4] [ref=e732]
            - paragraph [ref=e733]: Arquitetura preparada para suportar a infraestrutura crítica de festivais e turnês mundiais.
    - generic [ref=e736]:
      - generic [ref=e737]:
        - heading "O futuro do setor de eventos é digital e sustentável." [level=2] [ref=e738]
        - paragraph [ref=e739]: Estamos construindo uma infraestrutura que permite ao mercado escalar sem comprometer o planeta, unindo a robustez da engenharia energética com a agilidade do software B2B.
        - generic [ref=e740]:
          - generic [ref=e741]:
            - img [ref=e743]
            - heading "Crescimento Acelerado" [level=4] [ref=e746]
            - paragraph [ref=e747]: Demanda por eventos corporativos cresce 15% ao ano.
          - generic [ref=e748]:
            - img [ref=e750]
            - heading "Filtro ESG" [level=4] [ref=e755]
            - paragraph [ref=e756]: 90% dos investidores priorizam empresas sustentáveis.
      - generic [ref=e757]:
        - generic [ref=e758]:
          - paragraph [ref=e759]: 90%
          - paragraph [ref=e760]: Transformação Digital
          - paragraph [ref=e761]: Nossa meta é digitalizar 90% das transações energéticas do mercado de eventos brasileiro até 2030.
        - separator [ref=e762]
        - generic [ref=e763]:
          - generic [ref=e764]:
            - img [ref=e765]
            - heading "Confiabilidade" [level=5] [ref=e768]
            - paragraph [ref=e769]: Protocolos de gestão de risco em cada contrato assinado.
          - generic [ref=e770]:
            - img [ref=e771]
            - heading "Escalabilidade" [level=5] [ref=e773]
            - paragraph [ref=e774]: Desenvolvido para suportar desde reuniões a festivais.
    - generic [ref=e777]:
      - generic [ref=e779]:
        - generic [ref=e780]: TRANSPARENT GROWTH
        - heading "Planos de Infraestrutura." [level=2] [ref=e781]:
          - text: Planos de
          - text: Infraestrutura.
        - paragraph [ref=e782]: Provisionamento técnico moldado para a escala e complexidade da sua operação.
      - generic [ref=e783]:
        - generic [ref=e786]:
          - generic [ref=e787]:
            - img [ref=e789]
            - generic [ref=e792]:
              - heading "Standard" [level=3] [ref=e793]
              - paragraph [ref=e794]: Ideal para eventos regionais e infraestruturas em fase de transição.
          - generic [ref=e795]:
            - generic [ref=e797]: Scalable from
            - generic [ref=e798]:
              - generic [ref=e799]: Custom
              - generic [ref=e800]: / Node
          - list [ref=e801]:
            - listitem [ref=e802]:
              - img [ref=e804]
              - generic [ref=e806]: Intermediação com 1 provedor
            - listitem [ref=e807]:
              - img [ref=e809]
              - generic [ref=e811]: Monitoramento básico de carga
            - listitem [ref=e812]:
              - img [ref=e814]
              - generic [ref=e816]: Dashboard de acompanhamento
            - listitem [ref=e817]:
              - img [ref=e819]
              - generic [ref=e821]: Certificação I-REC básica
            - listitem [ref=e822]:
              - img [ref=e824]
              - generic [ref=e826]: Suporte via tickets
          - button "Configure Stack" [ref=e827]:
            - generic [ref=e829]:
              - text: Configure Stack
              - img [ref=e830]
        - generic [ref=e833]:
          - generic [ref=e835]:
            - img [ref=e836]
            - text: Optimal Choice
          - generic [ref=e839]:
            - generic [ref=e840]:
              - img [ref=e842]
              - generic [ref=e844]:
                - heading "Enterprise" [level=3] [ref=e845]
                - paragraph [ref=e846]: Para grandes festivais e turnês que exigem infraestrutura crítica e redundância.
            - generic [ref=e847]:
              - generic [ref=e849]: Scalable from
              - generic [ref=e850]:
                - generic [ref=e851]: Scale
                - generic [ref=e852]: / Node
            - list [ref=e853]:
              - listitem [ref=e854]:
                - img [ref=e856]
                - generic [ref=e858]: Múltiplos provedores globais
              - listitem [ref=e859]:
                - img [ref=e861]
                - generic [ref=e863]: Gestão de Smart Contracts
              - listitem [ref=e864]:
                - img [ref=e866]
                - generic [ref=e868]: Consultoria técnica 24/7
              - listitem [ref=e869]:
                - img [ref=e871]
                - generic [ref=e873]: Auditoria em Blockchain
              - listitem [ref=e874]:
                - img [ref=e876]
                - generic [ref=e878]: "SLA: 99.99% Availability"
              - listitem [ref=e879]:
                - img [ref=e881]
                - generic [ref=e883]: Dedicated Account Manager
            - button "Configure Stack" [ref=e884]:
              - generic [ref=e886]:
                - text: Configure Stack
                - img [ref=e887]
      - generic [ref=e889]:
        - paragraph [ref=e890]: Looking for customized SLA or private grid deployment?
        - button "Speak with Infrastructure team" [ref=e891]:
          - text: Speak with Infrastructure team
          - img [ref=e892]
    - generic [ref=e899]:
      - generic [ref=e900]:
        - generic [ref=e903]: Social Proof
        - img [ref=e905]
      - generic [ref=e908]:
        - generic [ref=e909]:
          - img [ref=e910]
          - text: Case de Sucesso
        - heading "\"Toda a minha produção mudou de nível quando a energia deixou de ser um risco e passou a ser uma vantagem competitiva de sustentabilidade.\"" [level=3] [ref=e914]
        - generic [ref=e916]:
          - paragraph [ref=e917]: Mariana Sousa é produtora de eventos culturais que buscava uma narrativa de sustentabilidade real para atrair grandes patrocínios em festivais de música.
          - generic [ref=e918]:
            - paragraph [ref=e919]: Mariana Souza
            - paragraph [ref=e920]: Head de Produção • GreenFest
    - generic [ref=e922]:
      - generic [ref=e923]:
        - heading "Soluções para todo o ecossistema." [level=2] [ref=e924]
        - paragraph [ref=e925]: Seja você um organizador buscando eficiência ou um provedor buscando escala.
      - generic [ref=e926]:
        - generic [ref=e927]:
          - generic [ref=e929]:
            - img [ref=e931]
            - generic [ref=e935]:
              - heading "Empresas de Eventos" [level=3] [ref=e936]
              - paragraph [ref=e937]: Contrate energia limpa com previsibilidade de custos e 100% de rastreabilidade para seus projetos.
          - button "Acessar Plataforma" [ref=e938]:
            - generic [ref=e939]:
              - text: Acessar Plataforma
              - img [ref=e940]
        - generic [ref=e942]:
          - generic [ref=e944]:
            - img [ref=e946]
            - generic [ref=e949]:
              - heading "Provedores de Energia" [level=3] [ref=e950]
              - paragraph [ref=e951]: Digitalize seu processo comercial e encontre demandas qualificadas através de uma interface global.
          - button "Seja um Parceiro" [ref=e952]:
            - generic [ref=e953]:
              - text: Seja um Parceiro
              - img [ref=e954]
    - generic [ref=e958]:
      - generic [ref=e960]:
        - generic [ref=e961]: THE DETAILS
        - heading "Perguntas Frequentes." [level=2] [ref=e962]:
          - text: Perguntas
          - text: Frequentes.
        - paragraph [ref=e963]: Esclareça dúvidas técnicas sobre a infraestrutura digital e energética da EcoVolt.
      - generic "Enterprise FAQ Accordion" [ref=e964]:
        - generic [ref=e966] [cursor=pointer]:
          - generic [ref=e967]:
            - generic [ref=e968]:
              - generic [ref=e969]:
                - img [ref=e970]
                - generic [ref=e973]: Enterprise Inquiry
              - heading "Como a EcoVolt garante a procedência da energia?" [level=4] [ref=e974]
            - img [ref=e976]
          - paragraph [ref=e979]: Trabalhamos exclusivamente com provedores homologados que utilizam certificação I-REC e auditoria em blockchain para garantir que cada kW entregue ao evento venha de fontes 100% renováveis e auditáveis em tempo real.
        - generic [ref=e982] [cursor=pointer]:
          - generic [ref=e983]:
            - generic [ref=e984]:
              - img [ref=e985]
              - generic [ref=e988]: Enterprise Inquiry
            - heading "A plataforma suporta eventos internacionais?" [level=4] [ref=e989]
          - img [ref=e991]
        - generic [ref=e994] [cursor=pointer]:
          - generic [ref=e995]:
            - generic [ref=e996]:
              - img [ref=e997]
              - generic [ref=e1000]: Enterprise Inquiry
            - heading "Quanto tempo leva para implementar a solução?" [level=4] [ref=e1001]
          - img [ref=e1003]
        - generic [ref=e1006] [cursor=pointer]:
          - generic [ref=e1007]:
            - generic [ref=e1008]:
              - img [ref=e1009]
              - generic [ref=e1012]: Enterprise Inquiry
            - heading "Como funciona a reconciliação financeira?" [level=4] [ref=e1013]
          - img [ref=e1015]
      - generic [ref=e1016] [cursor=pointer]:
        - generic [ref=e1017]:
          - img [ref=e1019]
          - generic [ref=e1021]:
            - paragraph [ref=e1022]: Ainda tem dúvidas?
            - paragraph [ref=e1023]: Nossa equipe de engenharia está pronta para ajudar.
        - button "Falar com Especialista" [ref=e1024]
    - generic [ref=e1029]:
      - generic [ref=e1030]:
        - generic [ref=e1031]:
          - generic [ref=e1032]:
            - generic [ref=e1033]: DEMONSTRAÇÃO CORPORATIVA
            - heading "Energia para a próxima escala." [level=2] [ref=e1034]
          - paragraph [ref=e1035]: Preencha os dados e receba uma análise de viabilidade técnica personalizada para sua infraestrutura.
        - generic [ref=e1036]:
          - generic [ref=e1037] [cursor=pointer]:
            - img [ref=e1039]
            - generic [ref=e1042]:
              - paragraph [ref=e1043]: Enterprise Sales
              - paragraph [ref=e1044]: solutions@ecovolt.app
          - generic [ref=e1045] [cursor=pointer]:
            - img [ref=e1047]
            - generic [ref=e1049]:
              - paragraph [ref=e1050]: Suporte 24/7
              - paragraph [ref=e1051]: +55 (11) 9999-9999
        - generic [ref=e1052]:
          - generic [ref=e1053]:
            - img [ref=e1054]
            - text: Infraestrutura Auditada ISO 50001
          - generic [ref=e1057]:
            - img [ref=e1058]
            - text: SLA de Disponibilidade 99.99%
      - form "Lead Capture Form" [ref=e1063]:
        - generic [ref=e1064]:
          - generic [ref=e1065]:
            - text: Nome Completo
            - 'textbox "Ex: Roberto Lima" [ref=e1067]'
          - generic [ref=e1068]:
            - text: Email Corporativo
            - textbox "roberto@agencia.com" [ref=e1070]
        - generic [ref=e1071]:
          - generic [ref=e1072]:
            - text: Empresa / Agência
            - textbox "Sua Empresa Ltda" [ref=e1074]
          - generic [ref=e1075]:
            - text: Expectativa de Público
            - generic [ref=e1076]:
              - combobox [ref=e1077]:
                - option "Selecione o tamanho" [selected]
                - option "Até 5.000 pessoas"
                - option "5.000 a 20.000 pessoas"
                - option "20.000 a 100.000 pessoas"
                - option "Acima de 100.000 pessoas"
              - generic:
                - img
        - generic [ref=e1078]:
          - text: Desafios Energéticos Atuais (Opcional)
          - textbox "Como podemos ajudar sua operação hoje?" [ref=e1080]
        - button "Solicitar Análise Técnica" [ref=e1081]:
          - generic [ref=e1083]:
            - text: Solicitar Análise Técnica
            - img [ref=e1084]
        - paragraph [ref=e1089]: Sistemas de análise consultiva ativos agora
    - generic [ref=e1091]:
      - generic [ref=e1092]:
        - generic [ref=e1093]:
          - generic [ref=e1094] [cursor=pointer]:
            - img [ref=e1096]
            - generic [ref=e1101]:
              - generic [ref=e1102]:
                - generic [ref=e1103]: ECO
                - generic [ref=e1104]: VOLT
              - generic [ref=e1107]: Enterprise
          - paragraph [ref=e1108]: A espinha dorsal energética para a próxima geração de eventos globais e sustentáveis.
          - generic [ref=e1109]:
            - img [ref=e1111] [cursor=pointer]
            - img [ref=e1114] [cursor=pointer]
            - img [ref=e1119] [cursor=pointer]
        - generic [ref=e1122]:
          - generic [ref=e1123]:
            - heading "Produto" [level=4] [ref=e1124]
            - list [ref=e1125]:
              - listitem [ref=e1126]:
                - link "Como Funciona" [ref=e1127] [cursor=pointer]:
                  - /url: /product/how-it-works
                  - text: Como Funciona
                  - img [ref=e1128]
              - listitem [ref=e1131]:
                - link "Plataforma" [ref=e1132] [cursor=pointer]:
                  - /url: /product/platform
                  - text: Plataforma
                  - img [ref=e1133]
              - listitem [ref=e1136]:
                - link "Segurança" [ref=e1137] [cursor=pointer]:
                  - /url: /product/security
                  - text: Segurança
                  - img [ref=e1138]
              - listitem [ref=e1141]:
                - link "Preços" [ref=e1142] [cursor=pointer]:
                  - /url: /product/pricing
                  - text: Preços
                  - img [ref=e1143]
          - generic [ref=e1146]:
            - heading "Empresa" [level=4] [ref=e1147]
            - list [ref=e1148]:
              - listitem [ref=e1149]:
                - link "Sobre Nós" [ref=e1150] [cursor=pointer]:
                  - /url: /company/about
                  - text: Sobre Nós
                  - img [ref=e1151]
              - listitem [ref=e1154]:
                - link "Carreiras" [ref=e1155] [cursor=pointer]:
                  - /url: /company/careers
                  - text: Carreiras
                  - img [ref=e1156]
              - listitem [ref=e1159]:
                - link "Blog" [ref=e1160] [cursor=pointer]:
                  - /url: /company/blog
                  - text: Blog
                  - img [ref=e1161]
              - listitem [ref=e1164]:
                - link "Sustentabilidade" [ref=e1165] [cursor=pointer]:
                  - /url: /company/sustainability
                  - text: Sustentabilidade
                  - img [ref=e1166]
          - generic [ref=e1169]:
            - heading "Recursos" [level=4] [ref=e1170]
            - list [ref=e1171]:
              - listitem [ref=e1172]:
                - link "Documentação" [ref=e1173] [cursor=pointer]:
                  - /url: /resources/docs
                  - text: Documentação
                  - img [ref=e1174]
              - listitem [ref=e1177]:
                - link "API Reference" [ref=e1178] [cursor=pointer]:
                  - /url: /resources/api-reference
                  - text: API Reference
                  - img [ref=e1179]
              - listitem [ref=e1182]:
                - link "Status" [ref=e1183] [cursor=pointer]:
                  - /url: /resources/status
                  - text: Status
                  - img [ref=e1184]
              - listitem [ref=e1187]:
                - link "Suporte" [ref=e1188] [cursor=pointer]:
                  - /url: /resources/support
                  - text: Suporte
                  - img [ref=e1189]
          - generic [ref=e1192]:
            - heading "Legal" [level=4] [ref=e1193]
            - list [ref=e1194]:
              - listitem [ref=e1195]:
                - link "Privacidade" [ref=e1196] [cursor=pointer]:
                  - /url: /legal/privacy
                  - text: Privacidade
                  - img [ref=e1197]
              - listitem [ref=e1200]:
                - link "Termos de Uso" [ref=e1201] [cursor=pointer]:
                  - /url: /legal/terms
                  - text: Termos de Uso
                  - img [ref=e1202]
              - listitem [ref=e1205]:
                - link "Cookies" [ref=e1206] [cursor=pointer]:
                  - /url: /legal/cookies
                  - text: Cookies
                  - img [ref=e1207]
              - listitem [ref=e1210]:
                - link "Compliance" [ref=e1211] [cursor=pointer]:
                  - /url: /legal/compliance
                  - text: Compliance
                  - img [ref=e1212]
      - generic [ref=e1215]:
        - generic [ref=e1216]:
          - paragraph [ref=e1217]: © 2026 EcoVolt Technologies Inc.
          - generic [ref=e1220]: Global Network Active
        - generic [ref=e1221]:
          - generic [ref=e1222]:
            - img [ref=e1223]
            - text: Brazil (PT-BR)
          - generic [ref=e1227] [cursor=pointer]: System Status
  - button "Open Next.js Dev Tools" [ref=e1234] [cursor=pointer]:
    - generic [ref=e1237]:
      - text: Compiling
      - generic [ref=e1238]:
        - generic [ref=e1239]: .
        - generic [ref=e1240]: .
        - generic [ref=e1241]: .
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * EcoVolt E2E — Critical Conversion Path
  5   |  *
  6   |  * Selectors derived directly from source code analysis:
  7   |  * - Hero H1: role=heading level=1 (text: "Energia para a próxima escala.")
  8   |  * - Hero CTAs: role=button name="Agendar Trial" | "Documentação" (are <button>, not <a>)
  9   |  * - Nav: <nav> with <a> links from NAV_LINKS constant
  10  |  * - Form submit: role=button name="Solicitar Contato"
  11  |  * - Success state: <h3> text "Solicitação Enviada!"
  12  |  * - Footer: <footer> with groups "Produto", "Empresa", "Recursos", "Legal"
  13  |  *
  14  |  * Framer Motion mitigation: waitForLoadState('networkidle') + 1000ms settle
  15  |  */
  16  | 
  17  | const HYDRATION_WAIT = 1200;
  18  | 
  19  | test.describe("Landing Page — Hero & Navigation", () => {
  20  |   test.beforeEach(async ({ page }) => {
> 21  |     await page.goto("/");
      |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  22  |     await page.waitForLoadState("networkidle");
  23  |     await page.waitForTimeout(HYDRATION_WAIT);
  24  |   });
  25  | 
  26  |   test("should render the H1 heading", async ({ page }) => {
  27  |     const h1 = page.getByRole("heading", { level: 1 });
  28  |     await expect(h1).toBeVisible({ timeout: 10_000 });
  29  |     // Verify it contains the expected text (partial match, resilient to line breaks)
  30  |     const text = await h1.innerText();
  31  |     expect(text).toMatch(/energia|próxima|escala/i);
  32  |   });
  33  | 
  34  |   test("should render hero CTA buttons — Agendar Trial and Documentação", async ({ page }) => {
  35  |     const primaryCTA = page.getByRole("button", { name: /agendar trial/i });
  36  |     await expect(primaryCTA).toBeVisible({ timeout: 10_000 });
  37  | 
  38  |     const secondaryCTA = page.getByRole("button", { name: /documentação/i });
  39  |     await expect(secondaryCTA).toBeVisible({ timeout: 10_000 });
  40  |   });
  41  | 
  42  |   test("should render Navbar with navigation links", async ({ page }) => {
  43  |     const nav = page.locator("nav").first();
  44  |     await expect(nav).toBeVisible();
  45  | 
  46  |     // NAV_LINKS from constants.tsx
  47  |     for (const label of ["Solução", "Como Funciona", "Plataforma", "Benefícios", "Contato"]) {
  48  |       await expect(page.getByRole("link", { name: label, exact: true }).first()).toBeVisible();
  49  |     }
  50  |   });
  51  | 
  52  |   test("should render Footer with all section groups", async ({ page }) => {
  53  |     // Scroll to bottom
  54  |     await page.keyboard.press("End");
  55  |     await page.waitForTimeout(600);
  56  | 
  57  |     const footer = page.locator("footer");
  58  |     await expect(footer).toBeVisible({ timeout: 10_000 });
  59  | 
  60  |     for (const group of ["Produto", "Empresa", "Recursos", "Legal"]) {
  61  |       await expect(footer.getByText(group, { exact: true })).toBeVisible();
  62  |     }
  63  |   });
  64  | });
  65  | 
  66  | test.describe("Lead Submission Form — Conversion Path", () => {
  67  |   test.beforeEach(async ({ page }) => {
  68  |     await page.goto("/");
  69  |     await page.waitForLoadState("networkidle");
  70  |     await page.waitForTimeout(HYDRATION_WAIT);
  71  | 
  72  |     // Scroll incrementally to trigger lazy-loaded sections
  73  |     for (let i = 0; i < 6; i++) {
  74  |       await page.keyboard.press("PageDown");
  75  |       await page.waitForTimeout(250);
  76  |     }
  77  |   });
  78  | 
  79  |   test("should display the lead submission form", async ({ page }) => {
  80  |     const form = page.locator("form").first();
  81  |     await expect(form).toBeVisible({ timeout: 15_000 });
  82  | 
  83  |     // Verify key form fields are present (by label text from LeadSubmissionForm.tsx)
  84  |     await expect(page.getByLabel("Nome Completo")).toBeVisible({ timeout: 8_000 });
  85  |     await expect(page.getByLabel("Email Corporativo")).toBeVisible();
  86  |     await expect(page.getByLabel("Empresa")).toBeVisible();
  87  |   });
  88  | 
  89  |   test("should show validation errors on empty submit", async ({ page }) => {
  90  |     const form = page.locator("form").first();
  91  |     await expect(form).toBeVisible({ timeout: 15_000 });
  92  | 
  93  |     // Submit button text from source: "Solicitar Contato"
  94  |     const submitBtn = page.getByRole("button", { name: /solicitar contato/i });
  95  |     await expect(submitBtn).toBeVisible({ timeout: 8_000 });
  96  |     await submitBtn.click();
  97  | 
  98  |     // react-hook-form renders errors as text next to inputs
  99  |     // Zod schema requires: name, company, email, phone, role, segment
  100 |     const firstError = page.locator("p.text-red-500, span.text-red-500, p[class*='error'], [data-error]").first();
  101 |     await expect(firstError).toBeVisible({ timeout: 8_000 });
  102 |   });
  103 | 
  104 |   test("should fill and submit the lead form successfully", async ({ page }) => {
  105 |     const form = page.locator("form").first();
  106 |     await expect(form).toBeVisible({ timeout: 15_000 });
  107 | 
  108 |     // Fill required fields (labels from LeadSubmissionForm.tsx)
  109 |     await page.getByLabel("Nome Completo").fill("João Silva");
  110 |     await page.getByLabel("Empresa").fill("TechCorp Ltda");
  111 |     await page.getByLabel("Email Corporativo").fill("joao.silva@techcorp.com.br");
  112 |     await page.getByLabel("Telefone / WhatsApp").fill("(11) 99999-8888");
  113 |     await page.getByLabel("Seu Cargo").fill("CTO");
  114 |     await page.getByLabel("Segmento de Atuação").selectOption("corporativo");
  115 | 
  116 |     const submitBtn = page.getByRole("button", { name: /solicitar contato/i });
  117 |     await submitBtn.click();
  118 | 
  119 |     // Success state from LeadSubmissionForm.tsx: <h3>Solicitação Enviada!</h3>
  120 |     const successHeading = page.getByRole("heading", { name: /solicitação enviada/i });
  121 |     await expect(successHeading).toBeVisible({ timeout: 15_000 });
```