import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

import Toolbar from './toolbar';
import theme from './theme';

const onError = (error: any) => {
  console.log(error);
};

const Editor = () => {
  const initialConfig = {
    namespace: 'LexicalEditor',
    nodes: [],
    theme,
    onError
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className='editor-container'>
        <Toolbar />

        <div className='editor-inner'>
          <RichTextPlugin
            contentEditable={<ContentEditable className='editor-input' />}
            placeholder={
              <div className='editor-placeholder'>Enter some text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <AutoFocusPlugin />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default Editor;
