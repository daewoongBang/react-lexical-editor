import { useCallback, useEffect, useRef, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from 'lexical';
import { FORMAT_TEXT_COMMAND } from 'lexical';

import Divider from './common/divider';
import { Undo, Redo, Bold, Italic } from 'assets/toolbar';

const LowPriority = 1;

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const [canUndo, setUndo] = useState(false);
  const [canRedo, setRedo] = useState(false);
  const [isBold, setBold] = useState(false);
  const [isItalic, setItalic] = useState(false);

  const toolbarRef = useRef(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      setBold(selection.hasFormat('bold'));
      setItalic(selection.hasFormat('italic'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          updateToolbar();

          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        payload => {
          setUndo(payload);

          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        payload => {
          setRedo(payload);

          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  return (
    <div className='toolbar' ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={'toolbar-item spaced'}
        aria-label={'Undo'}
      >
        <Undo />
      </button>

      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={'toolbar-item spaced'}
        aria-label={'Redo'}
      >
        <Redo />
      </button>

      <Divider />

      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label={'Format Bold'}
      >
        <Bold />
      </button>

      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label={'Format Italics'}
      >
        <Italic />
      </button>
    </div>
  );
};

export default Toolbar;
