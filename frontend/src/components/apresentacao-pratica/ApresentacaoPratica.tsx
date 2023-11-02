import { Pratica } from "@/types/Pratica";
import { VerticalStepper } from "@/components/vertical-stepper/verticalStepper";
import DescriptionRender from "@/components/DescriptionRender";

type ApresentacaoPraticaProps = {
  pratica: Pratica
}
export const ApresentacaoPratica = ({pratica}: ApresentacaoPraticaProps) => {
  const steps = [
    {
      label: 'Apresentação',
      description: <DescriptionRender description={pratica.apresentacao}/>,
    },
    {
      label: 'Introdução',
      description: <DescriptionRender description={pratica.descricao}/>,
    },
    {
      label: 'Quando Aplicar',
      description: <DescriptionRender description={pratica.quandoAplicar}/>,
    },
    {
      label: 'Fluo de Atividades',
      description: <DescriptionRender description={pratica.fluxoAtividades}/>,
    },
  ];

  return (
    <div>
      <VerticalStepper steps={steps}/>
    </div>
  )
}