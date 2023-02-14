module "plantuml-render" {
  function draw(
    inFileName: string,
    outFileName: string,
    format: "svg"
  ): void;
  export default draw;
}
