start
    = ns g:graph ns {return g}

graph
    = e:event ns sep ns gs:graph {
        let g0 = gs[0]; 
        let g1 = gs[1];
        g0.unshift(e.slice(0,3));
        g1 = g1.concat(e[3]);
        return [g0, g1];
      } / 
      e:event {
        if (e[3].length > 0) {
            return [[e.slice(0,3)], e[3]]
        }
        else {
            return [[e.slice(0,3)], []]
        }
      }

event
    = n:name ws l:label ws m:marking r:rels {return [n, l, m, r]} / 
      n:name ws l:label ws m:marking {return [n, l, m, []]}       /
      n:name ws m:marking r:rels {return [n, n, m, r]}         /
      n:name ws m:marking {return [n, n, m, []]}

marking
    = '()' {return [false,true,false]} / 
      '(' ws b1:bool sep b2:bool sep b3:bool ws ')' {return [b1, b2, b3]}

rels
    = ws nl ws '{' ns rs:relations* ns '}' {return rs} /
      ws '{' ns rs:relations* ns '}' {return rs}

relations
    = ws r:relation ws nl {return r} / ws r:relation ws {return r}

relation
    = es1:eventids ws '-->*'  ws es2:eventids {return ['c', es1, es2]} /
      es1:eventids ws '--><>' ws es2:eventids {return ['m', es1, es2]} /
      es1:eventids ws '*-->'  ws es2:eventids {return ['r', es1, es2]} /
      es1:eventids ws '-->+'  ws es2:eventids {return ['i', es1, es2]} /
      es1:eventids ws '-->%'  ws es2:eventids {return ['e', es1, es2]}

eventids
    = n:name {return [n]} / '(' ns:names ')' {return ns}

names
    = n:name sep ns:names {ns.push(n); return ns} / n:name {return [n]}

name 
    = t:text ws:(' ')+ n:name {return t.concat(ws.join(''), n)} /
      text

text
    = str:([a-z] / [A-Z] / [0-9] / '_')+ {return str.join('')}

label 
    = '<' lab:([a-z] / [A-Z] / [0-9] / '_' / '-' / ' ')+ '>' {return (lab.join(''))}

bool
    = '0' {return false} / '1' {return true}

// seperator
sep
    = ws ',' ws

// Removes at least 1 whitespace
ws1 = (' ' / '\t')+

// Removes whitespace
ws = (' ' / '\t')*

// Removes newline
nl
    = '\r\n' / '\n'

// Remove both nl and ws
ns = (ws1 / nl)*