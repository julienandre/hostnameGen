#! /usr/bin/env node
/**
 Module permettant de générer un UID unique depuis l'ID Hardware du RPi
 */
var fs = require('fs');
var os = require('os');
var bases = require('bases');
var program = require('commander');


// PRIVATE
var genHostnameUID = '';
var baseHostname = 'Station-';


program
  .version('1.0.3')
  .usage( '[options]' )
  .option('-s, --setup [hostname]', 'setup the generated hostname or the passed hostname if present'  )
  .parse(process.argv);

function getHostname( cb )
{
  // read the /proc/cpuinfo file and
  fs.readFile('/proc/cpuinfo', 'utf8', function handleCPUInfos (err, data) {
    if (err) {
      console.log('Error reading the cpuinfo file : %s', JSON.stringify(err, 0, 2));
    } else {
      // read the serial characters ( 16 last chars )
      var serialID = data.slice(-17, -1);
      console.log('-- Raw CPU Serial ID retrieved : %s', serialID);
      genHostnameUID = baseHostname + bases.toBase32(bases.fromBase16(serialID));
      console.log('-- Hostname generated : ' + genHostnameUID);
      if( cb ){ cb( genHostnameUID ); }
    }
  });
}


if( !program.setup ){ // pas d'argument -s
  getHostname();
}else{
  if( program.setup === true ){  // argument -s sans hostname
    getHostname( function( newhostname ){
      setupFinish(newhostname);
    });
  }else{
    setupFinish( program.setup );
  }
}



function setupFinish( newhostname ){
  var oldHostname = fs.readFileSync('/etc/hostname', 'utf8').trim();
  console.log('-- Seting up Hostname from '+oldHostname+' to '+ newhostname);
  fs.writeFileSync('/etc/hostname', newhostname );
  var hostsFile = fs.readFileSync('/etc/hosts', 'utf8');
  var hostsFile2 = hostsFile.replace( oldHostname, newhostname );
  fs.writeFileSync( '/etc/hosts', hostsFile2 );
  console.log('-- Seting up Hostname DONE, you have to reboot to take effect !');
}
