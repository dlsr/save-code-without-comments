import { ICodeCommentRemover } from "./code-comment-remover.interface";
import { ICodeWriter } from "./code-writer.interface";

export class SingleLineCommentRemoverAdapter implements ICodeCommentRemover {
  private singleCommentState = SingleCommentState.OutsideComment;
  private writingState = WritingState.IsNotWriting;
  constructor(private readonly codeWriter: ICodeWriter) { }

  public trimComment(c: string): void {
    switch (this.singleCommentState) {
      case SingleCommentState.OutsideComment:
        if (this.isForwardSlash(c)) {
          this.singleCommentState = SingleCommentState.MaybeCommentStart;
          break;
        }
        this.writeCharacter(c);
        break;
      case SingleCommentState.InsideComment:
        if (this.isNewLine(c)) {
          this.singleCommentState = SingleCommentState.OutsideComment;
        }
        break;
      case SingleCommentState.MaybeCommentStart:
        if (this.isForwardSlash(c)) {
          this.singleCommentState = SingleCommentState.InsideComment;
        } else {
          this.writeCharacter('/');
          this.writeCharacter(c);
          this.singleCommentState = SingleCommentState.OutsideComment;
        }
        break;
      default:
        throw new Error('Invalid comment state');
    }
  }

  private writeCharacter(c: string): void {
    switch (this.writingState) {
      case WritingState.IsWriting:
        if (this.isNewLine(c)) {
          this.writingState = WritingState.IsNotWriting;
          return;
        }

        this.codeWriter.write(c);
        break;

      case WritingState.IsNotWriting:
        if (!this.isSpace(c) && !this.isNewLine(c)) {
          this.writingState = WritingState.IsWriting;
          this.codeWriter.write(c);
        }

        break;

      default:
        throw new Error('Invalid writing state');
    }
  }

  private isForwardSlash(character: string): boolean {
    return character === '/';
  }

  private isNewLine(character: string): boolean {
    return character === '\n';
  }

  private isSpace(character: string): boolean {
    return character === ' ';
  }
}

enum SingleCommentState {
  OutsideComment,
  InsideComment,
  MaybeCommentStart,
}

enum WritingState {
  IsWriting,
  IsNotWriting,
}