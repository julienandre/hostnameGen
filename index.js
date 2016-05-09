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
  .version('1.0.0')
  .usage( '[options]' )
  .option('-f, --forcehostname [hostname]', 'force a special hostname to be setup.')
  .option('-s, --setup', 'setup the generated hostname', setup )
  .parse(process.argv);



function getHostname()
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
    }
  });
}
getHostname();

/**
 * Setup the hostname
 */
function setup(){
  var newHostName = ( program.forcehostname )?  program.forcehostname : genHostnameUID;
  var oldHostname = fs.readFileSync('/etc/hostname', 'utf8').trim();
  console.log('-- Seting up Hostname from '+oldHostname+' to '+ newHostName);
  fs.writeFileSync('/etc/hostname', newHostName );
  var hostsFile = fs.readFileSync('/etc/hosts', 'utf8');
  var hostsFile2 = hostsFile.replace( oldHostname, newHostName );
  fs.writeFileSync( '/etc/hosts', hostsFile2 );
  console.log('-- Seting up Hostname DONE, you have to reboot to take effect !');
}

