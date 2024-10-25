function include(file) {
 
    let script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;
 
    document.getElementsByTagName('head').item(0).appendChild(script);

}
 
/* Include Letters js files */
include('assets/letters/B_2.js');


/* Include Files js files */
include('src/EZWG.js');
include('src/Ex1_Standard_CGOL.js');
include('src/typer.js');
include('src/kickoff.js');