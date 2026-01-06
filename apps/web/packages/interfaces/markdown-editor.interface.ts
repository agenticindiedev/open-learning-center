export interface IMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface IToolbarAction {
  label: string;
  prefix: string;
  suffix: string;
  placeholder: string;
}
