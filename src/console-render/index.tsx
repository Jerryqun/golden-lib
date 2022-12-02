import ReactDom from 'react-dom';
import ArrayRender from './render/array';
import BasicRender from './render/basic';
import ObjectRender from './render/object';

import React from 'react';
import './index.less';

interface ConsoleRenderProps {
  target: string;
}

export const getJSType = (obj: unknown): string => {
  const type = Object.prototype.toString.call(obj).slice(8, -1);
  return type.toLocaleLowerCase() as any;
};

export const typeMapping: any = {
  object: ObjectRender,
  array: ArrayRender,
  number: BasicRender,
  string: BasicRender,
  boolean: BasicRender,
  undefined: BasicRender,
  null: BasicRender,
};

export const RenderChildren = ({ value, log }: any) => {
  const VNode = typeMapping[getJSType(value)] || BasicRender;
  return <VNode value={value} log={log} />;
};

const DomRender = ({ values, log = console.log.bind(console) }: any) => {
  return (
    <div className="console-wrap">
      {values.map((value: any, index: number) => {
        return (
          <div className="console-wrap-row" key={`row-${index}`}>
            {value.map((v: any, index: number) => {
              return (
                <div className="console-wrap-row-col" key={`col-${index}`}>
                  <RenderChildren value={v} log={log} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

interface ResProps {
  listener: () => void;
  clear: () => void;
}

export default {
  create: ({ target }: ConsoleRenderProps): ResProps => {
    const HistoryLog: any = [];
    const console_log_bind_001 = console.log.bind(console);
    const print = (value: any[]) => {
      HistoryLog.push(value); // 添加到队列
      if (target) {
        ReactDom.render(
          <DomRender values={HistoryLog} log={console_log_bind_001} />,
          document.querySelector(target),
        );
      }
    };
    return {
      listener: () => {
        /** 修饰打印 */
        console.log = function (...p) {
          console_log_bind_001(...p);
          try {
            print(p);
          } catch (e) {
            console_log_bind_001('err', e);
          }
        };
      },
      clear: () => {
        HistoryLog.length = 0;
        ReactDom.render(null, document.querySelector(target));
      },
    };
  },
};
