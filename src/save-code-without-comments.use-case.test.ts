import { ICodeWriter } from "./code-writer.interface";
import { SingleLineCommentRemoverAdapter } from "./single-line-comment-remover.adapter";
import {  SaveCodeWithoutCommentsUseCase } from "./save-code-without-comments.use-case";

describe('SaveCodeWithoutCommentsUseCase', () => {
  it('should remove single line comments from code', () => {
    const mockedCodeWriter = new MockCodeWriter();
    const singleLineCommentRemoverAdapter = new SingleLineCommentRemoverAdapter(mockedCodeWriter);
    const useCase = new SaveCodeWithoutCommentsUseCase(singleLineCommentRemoverAdapter);
    const input = `
    
      // some comments

      
      var result = a / b;
        // some comments
      var result = a / b;

      // some comments // some comments // some comments

    `;

    useCase.execute(input);
    const expected = 'var result = a / b;var result = a / b;';
    const result = mockedCodeWriter.getResult();
    expect(result).toEqual(expected);
  });
});

class MockCodeWriter implements ICodeWriter {
  private result: string = '';
  write(c: string): void {
    this.result += c;
  }
  getResult(): string {
    return this.result;
  }
}