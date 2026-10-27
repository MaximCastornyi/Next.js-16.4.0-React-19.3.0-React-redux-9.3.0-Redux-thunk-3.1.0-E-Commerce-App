import React from "react";

export default class DialogErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("DialogModal Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Скрываем сломанный компонент модалки, предотвращая краш страницы
    }
    return this.props.children;
  }
}