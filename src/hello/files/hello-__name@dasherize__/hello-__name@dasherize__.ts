// dasherize -> formatar string PedroLucas para pedro-lucas
// classify -> formatar para PedroLucas

@Component({
    selector: 'hello-<%= dasherize(name) %>'
})
export class Hello<%= classify(name) %>Component {
    console.log('Hello <%= addExclamation(name) %>');
}