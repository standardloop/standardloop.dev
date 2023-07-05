import React from "react";

type MyProps = {};
type MyState = {};

export default class Circle extends React.Component<MyProps, MyState> {
    render() {
        return (
            <div className="rounded-full w-72 h-72 bg-cyan-300"></div>
        );
    };
}
