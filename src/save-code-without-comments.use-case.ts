import { ICodeCommentRemover } from "./code-comment-remover.interface";

export class SaveCodeWithoutCommentsUseCase {
  constructor(
    private readonly codeCommentRemover: ICodeCommentRemover,
  ) { }

  public execute(code: string): void {
    for (const char of code) {
      this.codeCommentRemover.trimComment(char);
    }
  }
}
