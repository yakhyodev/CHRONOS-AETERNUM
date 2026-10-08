$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = Join-Path $root 'public\chronos\phase04\references'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$images = @(
  @{ name='01-grand-arrival-prague-square.jpg'; source='Prague_-_Old_Town_Square.jpg' },
  @{ name='02-old-district-street.jpg'; source='Street_in_the_Old_Town_of_Prague.jpg' },
  @{ name='03-river-reveal-bridge.jpg'; source='Charles_bridge_from_Vltava%2C_Prague.jpg' },
  @{ name='04-bridge-detail.jpg'; source='Charles_Bridge.jpg' },
  @{ name='05-industrial-chimney.jpg'; source='Abandoned_chimney_-_geograph.org.uk_-_260454.jpg' },
  @{ name='06-observatory-greenwich.jpg'; source='Royal_Observatory%2C_Greenwich.jpg' }
)
foreach ($entry in $images) {
  $url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + $entry.source + '?width=1600'
  $out = Join-Path $dest $entry.name
  Write-Host ('Downloading ' + $entry.name)
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -MaximumRedirection 10 -TimeoutSec 90 -Headers @{'User-Agent'='Chronos-Aeternum-ReferenceCollector/1.0'}
    if ((Get-Item $out).Length -lt 10000) { throw 'Image is unexpectedly small' }
    Write-Host ('OK ' + $entry.name)
  } catch { Write-Warning ('FAILED: '+$entry.name+' '+$_.Exception.Message) }
}
Write-Host ('Completed. Look in: ' + $dest)
