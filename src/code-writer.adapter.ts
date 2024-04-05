import { ICodeWriter } from "./code-writer.interface";

export class CodeWriterAdapter implements ICodeWriter {
  public write(c: string): void { }
}