using Cargo.Client.Persisting;
using Cargo.Client.Persisting.Entity;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Cargo.Client.Terminal.Components
{
    /// <summary>
    /// Interaction logic for Parts.xaml
    /// </summary>
    public partial class PartsControl : UserControl

    {
        PartsViewModel model = new PartsViewModel();

        public PartsControl()
        {
            InitializeComponent();
            this.DataContext = model;           
        }

       
    }

    public class PartsViewModel : INotifyPropertyChanged
    {
        public PartsViewModel()
        {
            using (var ctx = new CargoDbContext())
            {
                Parts = new ObservableCollection<Part>(ctx.Parts.ToList());
            }
        }

        public ObservableCollection<Part> Parts { get; set; }

        public event PropertyChangedEventHandler PropertyChanged;
        protected void NotifyPropertyChanged(string info)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(info));
        }
    }
}

